const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const JobSeeker = require('../models/JobSeeker');
const Recruiter = require('../models/Recruiter');
const Organization = require('../models/Organizations');
const JobPost = require('../models/JobPost');
const Resume = require('../models/Resume');
const Application = require('../models/Application');

const organizations = [
    {
        gstin: "07AAAAA0000A1Z5",
        name: "TechCorp Solutions",
        companySize: "201-500",
        description: {
            about: "Leading technology solutions provider specializing in web and mobile applications.",
            vision: "To transform businesses through innovative technology solutions.",
            mission: "Delivering cutting-edge software solutions that drive business growth.",
            benefits: ["Health Insurance", "Work from Home", "Flexible Hours", "Learning Budget"]
        },
        contact: {
            email: "hr@techcorp.com",
            phone: "+91-9876543210",
            address: { street: "Tech Park, Sector 5", city: "Gurgaon", state: "Haryana", pincode: "122001", country: "India" }
        },
        website: "https://techcorp.com"
    },
    {
        gstin: "19AAAAA0000A1Z5",
        name: "InnovateLabs",
        companySize: "51-200",
        description: {
            about: "Startup focused on AI and machine learning solutions.",
            vision: "Making AI accessible to every business.",
            mission: "Building intelligent solutions for tomorrow's challenges.",
            benefits: ["Stock Options", "Flexible Work", "Health Coverage"]
        },
        contact: {
            email: "careers@innovatelabs.com",
            phone: "+91-8765432109",
            address: { street: "Innovation Hub", city: "Bangalore", state: "Karnataka", pincode: "560001", country: "India" }
        },
        website: "https://innovatelabs.com"
    }
];

const users = [
    {
        email: "recruiter1@techcorp.com",
        password: "password123",
        role: "recruiter",
        name: "Sarah Johnson",
        phone: "+91-9876543210",
        location: "Gurgaon, Haryana",
        profileCompleted: true
    },
    {
        email: "recruiter2@innovatelabs.com",
        password: "password123",
        role: "recruiter",
        name: "Raj Patel",
        phone: "+91-8765432109",
        location: "Bangalore, Karnataka",
        profileCompleted: true
    },
    {
        email: "john.doe@email.com",
        password: "password123",
        role: "jobseeker",
        name: "John Doe",
        phone: "+91-9876543211",
        location: "Delhi, India",
        profileCompleted: true
    },
    {
        email: "jane.smith@email.com",
        password: "password123",
        role: "jobseeker",
        name: "Jane Smith",
        phone: "+91-8765432110",
        location: "Pune, Maharashtra",
        profileCompleted: true
    }
];

const seedIfNeeded = async () => {
    try {
        const userCount = await User.countDocuments();
        if (userCount > 0) {
            console.log(`Database already has ${userCount} users. Skipping auto-seed.`);
            return;
        }

        console.log('🌱 Database is empty. Seeding initial test data...');
        const createdOrgs = await Organization.insertMany(organizations);
        
        const hashedUsers = await Promise.all(
            users.map(async (u) => ({
                ...u,
                password: await bcrypt.hash(u.password, 10)
            }))
        );
        const createdUsers = await User.insertMany(hashedUsers);

        const recruiter1 = createdUsers.find(u => u.email === 'recruiter1@techcorp.com');
        const recruiter2 = createdUsers.find(u => u.email === 'recruiter2@innovatelabs.com');
        const candidate1 = createdUsers.find(u => u.email === 'john.doe@email.com');

        if (recruiter1) {
            await Recruiter.create({
                user: recruiter1._id,
                organizationId: createdOrgs[0]._id,
                title: "Senior Technical Recruiter",
                bio: "Experienced technical recruiter with 5+ years in the tech industry.",
                department: "Human Resources",
                yearsOfExperience: 5
            });
        }
        if (recruiter2) {
            await Recruiter.create({
                user: recruiter2._id,
                organizationId: createdOrgs[1]._id,
                title: "Talent Acquisition Lead",
                bio: "Passionate about building AI & Cloud engineering teams.",
                department: "Human Resources",
                yearsOfExperience: 4
            });
        }

        if (candidate1) {
            await JobSeeker.create({
                user: candidate1._id,
                bio: "Full Stack Developer specializing in React, Node.js, and MongoDB.",
                skills: [
                    { name: "JavaScript", level: "advanced" },
                    { name: "React", level: "advanced" },
                    { name: "Node.js", level: "intermediate" },
                    { name: "MongoDB", level: "intermediate" }
                ],
                experience: [{
                    title: "Frontend Developer",
                    company: "StartupXYZ",
                    startDate: new Date("2022-01-15"),
                    endDate: new Date("2024-03-30"),
                    current: false,
                    description: "Built Web Applications with React"
                }],
                education: [{
                    degree: "Bachelor of Computer Science",
                    institution: "Delhi University",
                    startYear: 2018,
                    endYear: 2022,
                    score: "8.5 GPA"
                }]
            });
        }

        const jobPosts = [
            {
                title: "Senior Full Stack Developer",
                description: "We are looking for an experienced Full Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using modern technologies.",
                requirements: {
                    experience: { min: 2, max: 5 },
                    education: ["Bachelor's degree in CS"],
                    skills: { required: ["JavaScript", "React", "Node.js", "MongoDB"], preferred: ["TypeScript"] }
                },
                location: "Gurgaon, Haryana",
                jobType: "full-time",
                workMode: "hybrid",
                salary: { min: 1200000, max: 2000000 },
                status: "active",
                recruiter: recruiter1._id,
                organization: createdOrgs[0]._id
            },
            {
                title: "Frontend React Developer",
                description: "Build sleek user interfaces and modern web applications with React.",
                requirements: {
                    experience: { min: 1, max: 3 },
                    education: ["Bachelor's degree"],
                    skills: { required: ["React", "JavaScript", "HTML", "CSS"], preferred: ["Tailwind"] }
                },
                location: "Remote",
                jobType: "full-time",
                workMode: "remote",
                salary: { min: 800000, max: 1400000 },
                status: "active",
                recruiter: recruiter1._id,
                organization: createdOrgs[0]._id
            }
        ];

        await JobPost.insertMany(jobPosts);
        console.log('🎉 Auto-seeding completed successfully!');
    } catch (err) {
        console.error('Auto-seeding error:', err);
    }
};

module.exports = { seedIfNeeded };
