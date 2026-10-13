import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding matching PRD.md...');

  // 1. Default Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Seed primary admin: admin@nusu.edu.eg
  const adminNusu = await prisma.adminUser.upsert({
    where: { email: 'admin@nusu.edu.eg' },
    update: {
      password: hashedPassword,
      name: 'NUSU Super Administrator',
    },
    create: {
      email: 'admin@nusu.edu.eg',
      password: hashedPassword,
      name: 'NUSU Super Administrator',
    },
  });
  console.log(`✅ AdminUser seeded: ${adminNusu.email}`);

  // Seed secondary alias for compatibility: admin@suweb.edu
  await prisma.adminUser.upsert({
    where: { email: 'admin@suweb.edu' },
    update: {
      password: hashedPassword,
      name: 'SU Administrator',
    },
    create: {
      email: 'admin@suweb.edu',
      password: hashedPassword,
      name: 'SU Administrator',
    },
  });

  // 2. Clear and seed 4 NUSU Board Members across committees
  await prisma.boardMember.deleteMany({});
  const boardMembers = await prisma.boardMember.createMany({
    data: [
      {
        name: 'Youssef El-Masry',
        role: 'President',
        committee: 'Executive',
        major: 'Computer Science',
        imageUrl: 'http://localhost:9000/suweb-media/board_president.jpg',
        bio: 'Senior Computer Science major dedicated to student advocacy, campus transparency, and academic excellence at Nile University.',
        email: 'president@nusu.edu.eg',
        linkedin: 'https://linkedin.com/in/youssef-el-masry',
        order: 1,
      },
      {
        name: 'Nouran Mansour',
        role: 'VP of Academic Affairs',
        committee: 'Academics',
        major: 'Industrial & Service Engineering',
        imageUrl: 'http://localhost:9000/suweb-media/board_academics.jpg',
        bio: 'Junior Industrial Engineering student advocating for curriculum enhancement, peer-tutoring networks, and undergraduate research opportunities.',
        email: 'academics@nusu.edu.eg',
        linkedin: 'https://linkedin.com/in/nouran-mansour',
        order: 2,
      },
      {
        name: 'Karim Abdel-Rahman',
        role: 'VP of Student Life & Events',
        committee: 'Events',
        major: 'Business Administration',
        imageUrl: 'http://localhost:9000/suweb-media/board_events.jpg',
        bio: 'Passionate organizer behind high-energy cultural festivals, university-wide derby championships, and welcoming orientation weeks.',
        email: 'events@nusu.edu.eg',
        linkedin: 'https://linkedin.com/in/karim-abdelrahman',
        order: 3,
      },
      {
        name: 'Salma Hegazy',
        role: 'Director of Media & Communications',
        committee: 'Marketing',
        major: 'Digital Media & Communication',
        imageUrl: 'http://localhost:9000/suweb-media/board_marketing.jpg',
        bio: 'Creative multimedia strategist directing NUSU official visual identity, event coverage, and digital student outreach.',
        email: 'media@nusu.edu.eg',
        linkedin: 'https://linkedin.com/in/salma-hegazy',
        order: 4,
      },
    ],
  });
  console.log(`✅ Seeded ${boardMembers.count} NUSU Board Members (Executive, Academics, Events, Marketing)`);

  // 3. Clear and seed 3 upcoming Nile University Campus Events
  await prisma.event.deleteMany({});
  const events = await prisma.event.createMany({
    data: [
      {
        title: 'Nile University Fall Welcome Festival & Carnival',
        description: 'Celebrate the start of the semester with live student musical performances, food truck pavilions, student club booths, and carnival games.',
        date: new Date('2026-11-05T16:00:00Z'),
        location: 'Main Campus Plaza & Sports Complex',
        category: 'Social',
        imageUrl: 'http://localhost:9000/suweb-media/event_welcome_carnival.jpg',
      },
      {
        title: 'NU Tech & Innovation Hackathon 2026',
        description: 'A 36-hour non-stop challenge bringing together engineers, designers, and innovators to solve real-world problems with top industry mentors.',
        date: new Date('2026-11-20T09:00:00Z'),
        location: 'Innovation Center Lab 3 & Auditorium',
        category: 'Academic',
        imageUrl: 'http://localhost:9000/suweb-media/event_hackathon.jpg',
      },
      {
        title: 'NUSU Leadership & Alumni Townhall Summit',
        description: 'Engage with prominent Nile University alumni, student union delegates, and career mentors in a collaborative campus dialogue.',
        date: new Date('2026-12-02T11:00:00Z'),
        location: 'Grand Conference Hall (Bldg H)',
        category: 'Townhall',
        imageUrl: 'http://localhost:9000/suweb-media/event_career_summit.jpg',
      },
    ],
  });
  console.log(`✅ Seeded ${events.count} Nile University Campus Events`);

  // 4. Clear and seed 2 Highlight Videos
  await prisma.highlightVideo.deleteMany({});
  const videos = await prisma.highlightVideo.createMany({
    data: [
      {
        title: 'NUSU 2026 Annual Highlights & Year in Review',
        description: 'Relive the most memorable milestones, festivals, student representation achievements, and community drives from this academic year.',
        videoUrl: 'http://localhost:9000/suweb-media/highlights_2026.mp4',
        posterUrl: 'http://localhost:9000/suweb-media/thumb_highlights_2026.jpg',
      },
      {
        title: 'Nile Spirit Week & Campus Derby Aftermovie',
        description: 'Experience the electric atmosphere, sporting triumphs, and union pride from the annual Nile University Derby championship.',
        videoUrl: 'http://localhost:9000/suweb-media/spirit_week_aftermovie.mp4',
        posterUrl: 'http://localhost:9000/suweb-media/thumb_spirit_week.jpg',
      },
    ],
  });
  console.log(`✅ Seeded ${videos.count} Highlight Videos`);

  console.log('🎉 Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
