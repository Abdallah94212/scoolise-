const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const CURRENT_YEAR = new Date().getFullYear();
const LAST_FIVE_YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - 5 + i);

function computeTaux(nbAdmis, nbVoeux) {
  if (!nbVoeux) return 0;
  return Math.round((nbAdmis / nbVoeux) * 1000) / 10;
}

async function main() {
  console.log('Seed : nettoyage des tables...');
  await prisma.wish.deleteMany();
  await prisma.formationStat.deleteMany();
  await prisma.formation.deleteMany();
  await prisma.school.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seed : comptes de démonstration...');
  const adminPasswordHash = await bcrypt.hash('Admin1234!', 10);
  const studentPasswordHash = await bcrypt.hash('Etudiant1234!', 10);
  const staffPasswordHash = await bcrypt.hash('Formation1234!', 10);

  await prisma.user.create({
    data: {
      email: 'admin@scoolize.fr',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'Scoolize',
    },
  });

  const lea = await prisma.user.create({
    data: {
      email: 'lea.martin@lycee-demo.fr',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
      firstName: 'Léa',
      lastName: 'Martin',
      ine: '123456789AB',
    },
  });

  console.log('Seed : écoles et formations...');
  const schoolsData = [
    { name: 'IUT de Bordeaux', city: 'Bordeaux', type: 'IUT', website: 'https://iut.u-bordeaux.fr' },
    { name: 'Université de Bordeaux', city: 'Bordeaux', type: 'Université', website: 'https://www.u-bordeaux.fr' },
    { name: 'Lycée Montaigne', city: 'Bordeaux', type: 'CPGE', website: null },
    { name: 'Université Lyon 2', city: 'Lyon', type: 'Université', website: 'https://www.univ-lyon2.fr' },
    { name: 'IUT de Lyon 1', city: 'Villeurbanne', type: 'IUT', website: 'https://iut.univ-lyon1.fr' },
    { name: "École d'ingénieurs INSA Toulouse", city: 'Toulouse', type: 'École d\'ingénieurs', website: 'https://www.insa-toulouse.fr' },
  ];
  const schools = [];
  for (const data of schoolsData) {
    schools.push(await prisma.school.create({ data }));
  }
  const [iutBordeaux, uBordeaux, lyceeMontaigne, uLyon2, iutLyon1, insaToulouse] = schools;

  console.log('Seed : compte personnel d\'établissement (Prepare)...');
  await prisma.user.create({
    data: {
      email: 'camille.dupas@iut-bordeaux.fr',
      passwordHash: staffPasswordHash,
      role: 'SCHOOL_STAFF',
      firstName: 'Camille',
      lastName: 'Dupas',
      schoolId: iutBordeaux.id,
    },
  });

  const formationsData = [
    { schoolId: iutBordeaux.id, name: 'BUT Techniques de Commercialisation', type: 'BUT', domain: 'Économie & gestion', capacity: 24, description: 'Formation en 3 ans au commerce et à la relation client.' },
    { schoolId: iutBordeaux.id, name: 'BUT Informatique', type: 'BUT', domain: 'Sciences & ingénierie', capacity: 30, description: 'Développement logiciel, réseaux, données.' },
    { schoolId: uBordeaux.id, name: 'Licence Économie-Gestion', type: 'Licence', domain: 'Économie & gestion', capacity: 180, description: 'Licence généraliste en économie et gestion.' },
    { schoolId: uBordeaux.id, name: 'Licence Mathématiques', type: 'Licence', domain: 'Sciences', capacity: 90, description: 'Licence de mathématiques fondamentales et appliquées.' },
    { schoolId: uBordeaux.id, name: 'Licence Droit', type: 'Licence', domain: 'Droit', capacity: 220, description: 'Licence généraliste en droit.' },
    { schoolId: lyceeMontaigne.id, name: 'CPGE ECG (option Maths appliquées)', type: 'CPGE', domain: 'Économie & gestion', capacity: 36, description: 'Classe préparatoire économique et commerciale, voie générale.' },
    { schoolId: uLyon2.id, name: 'Licence Psychologie', type: 'Licence', domain: 'Sciences humaines', capacity: 260, description: 'Licence généraliste en psychologie.' },
    { schoolId: uLyon2.id, name: 'Licence Sociologie', type: 'Licence', domain: 'Sciences humaines', capacity: 140, description: 'Licence généraliste en sociologie.' },
    { schoolId: iutLyon1.id, name: 'BUT Génie Civil', type: 'BUT', domain: 'Sciences & ingénierie', capacity: 28, description: 'Conception et construction de bâtiments et infrastructures.' },
    { schoolId: iutLyon1.id, name: 'BUT Mesures Physiques', type: 'BUT', domain: 'Sciences & ingénierie', capacity: 26, description: 'Instrumentation, métrologie, contrôle qualité.' },
    { schoolId: insaToulouse.id, name: "Cycle ingénieur Génie Civil", type: "École d'ingénieurs", domain: 'Sciences & ingénierie', capacity: 60, description: 'Formation d\'ingénieur en 5 ans, génie civil et urbanisme.' },
    { schoolId: insaToulouse.id, name: 'Cycle ingénieur Informatique et Réseaux', type: "École d'ingénieurs", domain: 'Sciences & ingénierie', capacity: 72, description: 'Formation d\'ingénieur en 5 ans, informatique et réseaux.' },
  ];

  const formations = [];
  for (const data of formationsData) {
    formations.push(await prisma.formation.create({ data }));
  }

  console.log('Seed : statistiques des 5 dernières années...');
  for (const formation of formations) {
    for (const year of LAST_FIVE_YEARS) {
      const nbVoeux = 80 + Math.floor(Math.random() * 400);
      const nbPropositions = Math.floor(nbVoeux * (0.35 + Math.random() * 0.3));
      const nbAdmis = Math.floor(nbPropositions * (0.6 + Math.random() * 0.35));
      await prisma.formationStat.create({
        data: {
          formationId: formation.id,
          year,
          nbVoeux,
          nbPropositions,
          nbAdmis,
          tauxAcces: computeTaux(nbAdmis, nbVoeux),
        },
      });
    }
  }

  console.log('Seed : vœu de démonstration pour Léa...');
  await prisma.wish.create({
    data: { studentId: lea.id, formationId: formations[0].id, rank: 1, status: 'EN_ATTENTE' },
  });

  console.log('Seed terminé.');
  console.log('Compte admin              : admin@scoolize.fr / Admin1234!');
  console.log('Compte étudiant           : lea.martin@lycee-demo.fr / Etudiant1234!');
  console.log('Compte personnel Prepare  : camille.dupas@iut-bordeaux.fr / Formation1234! (IUT de Bordeaux)');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
