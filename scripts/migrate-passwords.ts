/**
 * Migration Script - Hash Existing Passwords
 * 
 * IMPORTANTE: Este script debe ejecutarse SOLO UNA VEZ
 * para migrar contraseñas existentes de texto plano a bcrypt.
 * 
 * ⚠️ ADVERTENCIA DE SEGURIDAD:
 * Si tu base de datos tiene usuarios con contraseñas en texto plano,
 * este script los actualizará a contraseñas hasheadas con bcrypt.
 * 
 * Después de ejecutar este script, las contraseñas originales
 * no podrán recuperarse (es lo correcto por seguridad).
 * 
 * Cómo ejecutar:
 * 1. Asegúrate de tener un backup de tu base de datos
 * 2. Verifica que DATABASE_URL esté configurada
 * 3. Ejecuta: npm run migrate:passwords
 * 
 * Agregar este script a package.json:
 * "scripts": {
 *   "migrate:passwords": "tsx scripts/migrate-passwords.ts"
 * }
 */

import bcrypt from 'bcrypt';
import prisma from '../src/lib/prisma';

const SALT_ROUNDS = 10;

/**
 * Verifica si una contraseña ya está hasheada con bcrypt
 * Los hashes de bcrypt siempre empiezan con "$2a$", "$2b$" o "$2y$"
 */
function isAlreadyHashed(password: string): boolean {
  return password.startsWith('$2a$') || 
         password.startsWith('$2b$') || 
         password.startsWith('$2y$');
}

/**
 * Migra todas las contraseñas de usuarios a formato hasheado
 */
async function migratePasswords() {
  console.log('🔐 Iniciando migración de contraseñas...\n');

  try {
    // Obtener todos los usuarios
    const users = await prisma.user.findMany();
    console.log(`📊 Total de usuarios encontrados: ${users.length}\n`);

    if (users.length === 0) {
      console.log('ℹ️  No hay usuarios para migrar.');
      return;
    }

    let migratedCount = 0;
    let alreadyHashedCount = 0;
    let errorCount = 0;

    // Procesar cada usuario
    for (const user of users) {
      console.log(`Procesando usuario: ${user.email}`);

      // Verificar si la contraseña ya está hasheada
      if (isAlreadyHashed(user.password)) {
        console.log(`  ✓ Ya hasheada - saltando`);
        alreadyHashedCount++;
        continue;
      }

      try {
        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
        
        // Actualizar en la base de datos
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword },
        });

        console.log(`  ✓ Migrada exitosamente`);
        migratedCount++;
      } catch (error) {
        console.error(`  ✗ Error migrando: ${error}`);
        errorCount++;
      }

      console.log(''); // Línea en blanco para separar
    }

    // Resumen
    console.log('═══════════════════════════════════════');
    console.log('📋 Resumen de la migración:');
    console.log('═══════════════════════════════════════');
    console.log(`✓ Contraseñas migradas: ${migratedCount}`);
    console.log(`→ Ya estaban hasheadas: ${alreadyHashedCount}`);
    console.log(`✗ Errores: ${errorCount}`);
    console.log(`📊 Total procesados: ${users.length}`);
    console.log('═══════════════════════════════════════\n');

    if (migratedCount > 0) {
      console.log('✅ Migración completada exitosamente.');
      console.log('\n⚠️  IMPORTANTE: Las contraseñas originales ya no son válidas.');
      console.log('Los usuarios deben usar sus contraseñas actuales para iniciar sesión.\n');
    } else if (alreadyHashedCount === users.length) {
      console.log('ℹ️  Todas las contraseñas ya estaban hasheadas.');
      console.log('No se realizaron cambios.\n');
    }

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    throw error;
  } finally {
    // Cerrar la conexión a Prisma
    await prisma.$disconnect();
  }
}

/**
 * Función principal con manejo de errores
 */
async function main() {
  try {
    // Confirmación antes de ejecutar
    console.log('⚠️  ADVERTENCIA ⚠️');
    console.log('Este script modificará las contraseñas en la base de datos.');
    console.log('Asegúrate de tener un backup antes de continuar.\n');

    // En producción, podrías añadir un prompt de confirmación:
    // const readline = require('readline').createInterface({...});
    // const answer = await readline.question('¿Continuar? (si/no): ');
    // if (answer !== 'si') { process.exit(0); }

    await migratePasswords();
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  }
}

// Ejecutar script
main();
