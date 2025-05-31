// scripts/studyPlan.js

const StudyPlan = (() => {
    // Based on NEET PG PYQ analysis (Illustrative - needs expert input for actual content)
    const plan = [
        // Day 1
        {
            day: 1,
            subject: "Medicine",
            topic: "Cardiology",
            subtopics: [
                "Ischemic Heart Disease (MI, Angina)",
                "Hypertension",
                "Heart Failure",
                "Arrhythmias basics",
                "Rheumatic Fever"
            ],
            checklist: [
                "Review Ischemic Heart Disease (MI, Angina), Hypertension, Heart Failure, Arrhythmias basics, Rheumatic Fever",
                "Solve MCQs focusing on ECGs, clinical scenarios, drug of choice for Cardiology"
            ],
            estimatedTime: "3-4 hours",
            priority: "high",
            keywords: ["Cardiology", "Ischemic Heart Disease", "MI", "Angina", "Hypertension", "Heart Failure", "Arrhythmias", "Rheumatic Fever", "ECG"]
        },
        // Day 2
        {
            day: 2,
            subject: "Medicine",
            topic: "Pulmonology & GIT",
            subtopics: [
                "COPD, Asthma, Pneumonia, TB",
                "GERD, Peptic Ulcer Disease, Inflammatory Bowel Disease, Jaundice approach"
            ],
            checklist: [
                "Review COPD, Asthma, Pneumonia, TB (Pulmonology)",
                "Review GERD, Peptic Ulcer Disease, IBD, Jaundice approach (GIT)",
                "Solve MCQs focusing on X-rays, PFTs, endoscopy findings for Pulmonology & GIT"
            ],
            estimatedTime: "3-4 hours",
            priority: "high",
            keywords: ["Pulmonology", "GIT", "COPD", "Asthma", "Pneumonia", "TB", "GERD", "PUD", "IBD", "Jaundice"]
        },
        // Day 3
        {
            day: 3,
            subject: "Surgery",
            topic: "General Surgery & Trauma",
            subtopics: [
                "Wound healing, Burns, Shock, Hernias, Appendicitis, Cholecystitis",
                "Basics of trauma (ATLS)"
            ],
            checklist: [
                "Review Wound healing, Burns, Shock, Hernias, Appendicitis, Cholecystitis",
                "Review Basics of trauma (ATLS)",
                "Solve MCQs on clinical presentation, investigation, and management in General Surgery & Trauma"
            ],
            estimatedTime: "3-4 hours",
            priority: "high",
            keywords: ["General Surgery", "Trauma", "Wound healing", "Burns", "Shock", "Hernias", "Appendicitis", "Cholecystitis", "ATLS"]
        },
        // Day 4
        {
            day: 4,
            subject: "Surgery",
            topic: "GIT & Urology Basics",
            subtopics: [
                "Intestinal obstruction, Colorectal cancer basics",
                "Benign Prostatic Hyperplasia, Renal stones"
            ],
            checklist: [
                "Review Intestinal obstruction, Colorectal cancer basics (GIT Surgery)",
                "Review Benign Prostatic Hyperplasia, Renal stones (Urology Basics)",
                "Solve MCQs focusing on imaging and surgical indications for GIT Surgery & Urology"
            ],
            estimatedTime: "3-4 hours",
            priority: "high",
            keywords: ["GIT Surgery", "Urology", "Intestinal obstruction", "Colorectal cancer", "BPH", "Renal stones"]
        },
        // Day 5
        {
            day: 5,
            subject: "Obstetrics & Gynaecology",
            topic: "Obstetrics",
            subtopics: [
                "Antenatal care, Normal labor, Abnormal labor (Malpresentations, obstructed labor)",
                "Antepartum Hemorrhage (APH), Postpartum Hemorrhage (PPH)",
                "Hypertensive disorders in pregnancy"
            ],
            checklist: [
                "Review Antenatal care, Normal & Abnormal labor, APH, PPH, Hypertensive disorders in pregnancy",
                "Solve MCQs on Partograph, management protocols, and complications in Obstetrics"
            ],
            estimatedTime: "3-4 hours",
            priority: "high",
            keywords: ["Obstetrics", "Antenatal care", "Labor", "APH", "PPH", "Hypertensive disorders", "Partograph"]
        },
        // Day 6
        {
            day: 6,
            subject: "Obstetrics & Gynaecology",
            topic: "Gynaecology",
            subtopics: [
                "Menstrual cycle & disorders, Fibroids, Endometriosis, PCOS",
                "Basics of Gynae oncology (Cervical, Ovarian, Endometrial cancer screening/basics)"
            ],
            checklist: [
                "Review Menstrual cycle & disorders, Fibroids, Endometriosis, PCOS",
                "Review Basics of Gynae oncology (Cervical, Ovarian, Endometrial)",
                "Solve MCQs on USG findings, hormonal basis, treatment in Gynaecology"
            ],
            estimatedTime: "3-4 hours",
            priority: "high",
            keywords: ["Gynaecology", "Menstrual disorders", "Fibroids", "Endometriosis", "PCOS", "Gynae oncology"]
        },
        // Day 7
        {
            day: 7,
            subject: "Revision & Assessment",
            topic: "Week 1 Review: Medicine, Surgery, OBG",
            subtopics: [
                "Mini-Test (Medicine/Surgery/OBG mix)",
                "Test Performance Analysis",
                "Revision of Weak Areas from Week 1"
            ],
            checklist: [
                "Take a mini-test (50-100 questions) covering Medicine, Surgery, OBG topics from Day 1-6",
                "Analyze test performance thoroughly: identify weak areas and reasons for errors",
                "Revise specific topics identified as weak from the test analysis",
                "Use buffer time for any pending topics from Week 1"
            ],
            estimatedTime: "3-4 hours",
            priority: "critical",
            keywords: ["Revision", "Assessment", "Mini-Test", "Medicine", "Surgery", "OBG", "Week 1"]
        },
// Day 8
        {
            day: 8,
            subject: "Pediatrics",
            topic: "Neonatology & Growth/Development",
            subtopics: [
                "Neonatal resuscitation, Neonatal jaundice, Common neonatal infections",
                "Growth milestones, Developmental delays"
            ],
            checklist: [
                "Review Neonatal resuscitation, Neonatal jaundice, Common neonatal infections",
                "Review Growth milestones and Developmental delays",
                "Solve MCQs on clinical scenarios and vaccination schedule in Pediatrics"
            ],
            estimatedTime: "3-4 hours",
            priority: "high",
            keywords: ["Pediatrics", "Neonatology", "Growth", "Development", "Neonatal resuscitation", "Neonatal jaundice", "Vaccination"]
        },
        // Day 9
        {
            day: 9,
            subject: "Pediatrics",
            topic: "Systemic Pediatrics (Respiratory, GIT, CNS)",
            subtopics: [
                "Common childhood infections (Pneumonia, Diarrhea)",
                "Seizure disorders, Nutritional deficiencies"
            ],
            checklist: [
                "Review common childhood infections (Pneumonia, Diarrhea)",
                "Review Seizure disorders and Nutritional deficiencies in children",
                "Solve MCQs on management and identifying syndromes in Systemic Pediatrics"
            ],
            estimatedTime: "3-4 hours",
            priority: "high",
            keywords: ["Pediatrics", "Systemic Pediatrics", "Childhood infections", "Pneumonia", "Diarrhea", "Seizures", "Nutritional deficiencies"]
        },
        // Day 10
        {
            day: 10,
            subject: "Pathology",
            topic: "General Pathology & Hematology",
            subtopics: [
                "Inflammation, Repair, Neoplasia basics",
                "Anemias, Leukemias, Coagulation disorders"
            ],
            checklist: [
                "Review Inflammation, Repair, Neoplasia basics (General Pathology)",
                "Review Anemias, Leukemias, Coagulation disorders (Hematology)",
                "Solve MCQs focusing on microscopic images and lab findings in Pathology"
            ],
            estimatedTime: "3-4 hours",
            priority: "high",
            keywords: ["Pathology", "General Pathology", "Hematology", "Inflammation", "Neoplasia", "Anemia", "Leukemia", "Coagulation"]
        },
        // Day 11
        {
            day: 11,
            subject: "Pathology",
            topic: "Systemic Pathology (CVS, RS, GIT)",
            subtopics: [
                "Correlate with Medicine/Surgery topics covered (e.g., MI pathology, Pneumonia types, IBD pathology)"
            ],
            checklist: [
                "Review Systemic Pathology of CVS, Respiratory System, GIT, correlating with clinical topics",
                "Solve MCQs on gross/microscopic features and special stains in Systemic Pathology"
            ],
            estimatedTime: "3-4 hours",
            priority: "high",
            keywords: ["Pathology", "Systemic Pathology", "CVS Pathology", "Respiratory Pathology", "GIT Pathology", "MI Pathology", "IBD Pathology"]
        },
        // Day 12
        {
            day: 12,
            subject: "Pharmacology",
            topic: "General Pharmacology & ANS, CVS Drugs",
            subtopics: [
                "Pharmacokinetics, Pharmacodynamics",
                "Cholinergic/Anticholinergic drugs, Adrenergic/Anti-adrenergic drugs",
                "Anti-hypertensives, Anti-arrhythmics, Drugs for Heart Failure"
            ],
            checklist: [
                "Review Pharmacokinetics, Pharmacodynamics, ANS drugs",
                "Review Anti-hypertensives, Anti-arrhythmics, Drugs for Heart Failure",
                "Solve MCQs on mechanism of action, side effects, drug interactions in Pharmacology"
            ],
            estimatedTime: "3-4 hours",
            priority: "high",
            keywords: ["Pharmacology", "Pharmacokinetics", "Pharmacodynamics", "ANS Drugs", "CVS Drugs", "Anti-hypertensives", "Anti-arrhythmics"]
        },
        // Day 13
        {
            day: 13,
            subject: "Pharmacology",
            topic: "CNS, Autacoids, Chemotherapy",
            subtopics: [
                "Sedatives/Hypnotics, Antidepressants, Antipsychotics",
                "NSAIDs, Opioids, Antimicrobials (classification, key drugs)"
            ],
            checklist: [
                "Review Sedatives/Hypnotics, Antidepressants, Antipsychotics",
                "Review NSAIDs, Opioids, Antimicrobials (classification, key drugs)",
                "Solve MCQs on clinical uses, contraindications, toxicity of these drugs"
            ],
            estimatedTime: "3-4 hours",
            priority: "high",
            keywords: ["Pharmacology", "CNS Drugs", "Autacoids", "Chemotherapy", "Antidepressants", "Antipsychotics", "NSAIDs", "Opioids", "Antimicrobials"]
        },
        // Day 14
        {
            day: 14,
            subject: "Revision & Assessment",
            topic: "Week 2 Review: Pediatrics, Pathology, Pharmacology",
            subtopics: [
                "Mini-Test (Pediatrics/Pathology/Pharmacology mix)",
                "Test Performance Analysis",
                "Revision of Weak Areas from Week 2"
            ],
            checklist: [
                "Take a mini-test (50-100 questions) covering Pediatrics, Pathology, Pharmacology topics from Day 8-13",
                "Analyze test performance thoroughly: identify weak areas and reasons for errors",
                "Revise specific topics identified as weak from the test analysis",
                "Use buffer time for any pending topics from Week 2"
            ],
            estimatedTime: "3-4 hours",
            priority: "critical",
            keywords: ["Revision", "Assessment", "Mini-Test", "Pediatrics", "Pathology", "Pharmacology", "Week 2"]
        },
// Day 15
        {
            day: 15,
            subject: "Orthopedics & Radiology",
            topic: "Fractures & Imaging",
            subtopics: [
                "Fracture Healing",
                "Named fractures of Upper & Lower Limb (Colles', Smith's, Monteggia etc.)",
                "Compartment Syndrome",
                "Radiological identification of key fractures"
            ],
            checklist: [
                "Review Fracture Healing, Named fractures, Compartment Syndrome (Orthopedics)",
                "Practice identifying key fractures on X-rays (Radiology)",
                "Solve 25-30 combined MCQs on Orthopedics & related Radiology"
            ],
            estimatedTime: "3-4 hours",
            priority: "high",
            keywords: ["Orthopedics", "Radiology", "Fracture Healing", "Named Fractures", "Compartment Syndrome", "X-ray Interpretation"]
        },
        // Day 16
        {
            day: 16,
            subject: "Anesthesia & Physiology",
            topic: "Anesthetics & Respiratory Physiology",
            subtopics: [
                "General Anesthetics (IV & Inhalational)",
                "Muscle Relaxants",
                "Local Anesthetics",
                "Respiratory Physiology (Lung volumes, V/Q mismatch)"
            ],
            checklist: [
                "Review General Anesthetics, Muscle Relaxants, Local Anesthetics",
                "Review Respiratory Physiology (Lung volumes, V/Q mismatch)",
                "Solve 25-30 MCQs focusing on Anesthetic pharmacology & Respiratory Physiology"
            ],
            estimatedTime: "3-4 hours",
            priority: "high",
            keywords: ["Anesthesia", "Physiology", "General Anesthetics", "Muscle Relaxants", "Local Anesthetics", "Respiratory Physiology", "Lung Volumes", "V/Q Mismatch"]
        },
        // Day 17
        {
            day: 17,
            subject: "Dermatology & Pathology",
            topic: "Common Skin Conditions & Histo",
            subtopics: [
                "Psoriasis, Pemphigus vs. Bullous Pemphigoid, Steven-Johnson Syndrome (SJS), Leprosy",
                "Microscopic pathology findings of these dermatological conditions"
            ],
            checklist: [
                "Review Psoriasis, Pemphigus, Bullous Pemphigoid, SJS, Leprosy (Dermatology)",
                "Review Microscopic pathology findings for these dermatological conditions",
                "Solve 25-30 MCQs focusing on images and differentiating features"
            ],
            estimatedTime: "3-4 hours",
            priority: "high",
            keywords: ["Dermatology", "Pathology", "Psoriasis", "Pemphigus", "Bullous Pemphigoid", "SJS", "Leprosy", "Skin Pathology"]
        },
        // Day 18
        {
            day: 18,
            subject: "Psychiatry & Pharmacology",
            topic: "Major Psychiatric Disorders & Psychotropics",
            subtopics: [
                "Schizophrenia, Bipolar Disorder, Delirium vs. Dementia",
                "Anti-psychotics, Mood Stabilizers (Lithium), SSRIs"
            ],
            checklist: [
                "Review Schizophrenia, Bipolar Disorder, Delirium vs. Dementia (Psychiatry)",
                "Review Anti-psychotics, Mood Stabilizers (Lithium), SSRIs (Pharmacology)",
                "Solve 25-30 MCQs focusing on differentiating features and drug side effects"
            ],
            estimatedTime: "3-4 hours",
            priority: "high",
            keywords: ["Psychiatry", "Pharmacology", "Schizophrenia", "Bipolar Disorder", "Delirium", "Dementia", "Anti-psychotics", "Mood Stabilizers", "SSRIs"]
        },
        // Day 19
        {
            day: 19,
            subject: "Microbiology",
            topic: "Systemic Microbiology (Bacteria & Viruses)",
            subtopics: [
                "Staphylococcus, Streptococcus, Mycobacterium Tuberculosis",
                "Basics of Virology (esp. Hepatitis viruses)"
            ],
            checklist: [
                "Review Staphylococcus, Streptococcus, Mycobacterium Tuberculosis",
                "Review Basics of Virology (esp. Hepatitis viruses)",
                "Solve 30-40 MCQs focusing on lab diagnosis and key characteristics"
            ],
            estimatedTime: "3-4 hours",
            priority: "high",
            keywords: ["Microbiology", "Staphylococcus", "Streptococcus", "Mycobacterium Tuberculosis", "Virology", "Hepatitis Viruses"]
        },
        // Day 20
        {
            day: 20,
            subject: "Forensic Medicine & Toxicology",
            topic: "FMT Essentials",
            subtopics: [
                "Mechanical Injuries, Post-mortem changes",
                "IPC sections (medical relevance)",
                "Common poisons (Organophosphates, Opioids, Kerosene)"
            ],
            checklist: [
                "Review Mechanical Injuries, Post-mortem changes, relevant IPC sections",
                "Review Common poisons (Organophosphates, Opioids, Kerosene)",
                "Solve 30 MCQs focusing on key differentiating points and medico-legal aspects"
            ],
            estimatedTime: "3-4 hours",
            priority: "high",
            keywords: ["Forensic Medicine", "Toxicology", "Mechanical Injuries", "Post-mortem changes", "IPC", "Poisons", "Organophosphates", "Opioids"]
        },
        // Day 21
        {
            day: 21,
            subject: "Revision & Assessment",
            topic: "Week 3 Review & Volatile Topics Revision",
            subtopics: [
                "Mini-Test (Short Subjects Mix: PSM, Ophtha, ENT, Anaes, Radio, Derma, Psych)",
                "Test Performance Analysis",
                "Revision of Weak Areas from Week 3",
                "Grand Revision of Week 1-2 Volatile Topics"
            ],
            checklist: [
                "Take a mini-test covering PSM, Ophtha, ENT, Anesthesia, Radiology, Dermatology, Psychiatry",
                "Analyze test performance thoroughly",
                "Revise specific topics identified as weak from Week 3 subjects",
                "Perform a grand revision of volatile topics from Weeks 1 & 2",
                "Clear any backlog items"
            ],
            estimatedTime: "3-4 hours",
            priority: "critical",
            keywords: ["Revision", "Assessment", "Mini-Test", "Short Subjects", "Volatile Topics", "Week 3"]
        },
// Day 22
        {
            day: 22,
            subject: "Anatomy",
            topic: "Head & Neck, Neuroanatomy, Thorax (High-Yield)",
            subtopics: [
                "Cranial nerves, Triangles of neck, Brainstem",
                "Blood supply of brain, Thoracic viscera relations"
            ],
            checklist: [
                "Review Cranial nerves, Triangles of neck, Brainstem",
                "Review Blood supply of brain, Thoracic viscera relations",
                "Solve MCQs on clinical correlations, nerve injuries, applied anatomy (Focus on PYQs)"
            ],
            estimatedTime: "3-4 hours",
            priority: "high",
            keywords: ["Anatomy", "Head & Neck", "Neuroanatomy", "Thorax", "Cranial Nerves", "Brainstem", "PYQs"]
        },
        // Day 23
        {
            day: 23,
            subject: "Anatomy",
            topic: "Abdomen, Pelvis, Limbs (High-Yield)",
            subtopics: [
                "Inguinal canal, Perineum",
                "Brachial/Lumbosacral plexus, Important joints"
            ],
            checklist: [
                "Review Inguinal canal, Perineum",
                "Review Brachial/Lumbosacral plexus, Important joints",
                "Solve MCQs on applied aspects, imaging correlations (Focus on PYQs)"
            ],
            estimatedTime: "3-4 hours",
            priority: "high",
            keywords: ["Anatomy", "Abdomen", "Pelvis", "Limbs", "Inguinal Canal", "Plexus", "Joints", "PYQs"]
        },
        // Day 24
        {
            day: 24,
            subject: "Physiology",
            topic: "General, Nerve-Muscle, CVS, RS (High-Yield)",
            subtopics: [
                "Cell physiology, Action potential",
                "ECG, Cardiac cycle, Lung volumes/capacities, Oxygen transport"
            ],
            checklist: [
                "Review Cell physiology, Action potential",
                "Review ECG, Cardiac cycle, Lung volumes/capacities, Oxygen transport",
                "Solve MCQs on graphs, conceptual questions (Focus on PYQs)"
            ],
            estimatedTime: "3-4 hours",
            priority: "high",
            keywords: ["Physiology", "General Physiology", "Nerve-Muscle", "CVS Physiology", "Respiratory Physiology", "ECG", "Cardiac Cycle", "Lung Volumes", "PYQs"]
        },
        // Day 25
        {
            day: 25,
            subject: "Physiology",
            topic: "GIT, Endocrine, Renal (High-Yield)",
            subtopics: [
                "GI hormones, Digestion/Absorption",
                "Pituitary, Thyroid, Adrenal hormones",
                "Renal clearance, Acid-base balance"
            ],
            checklist: [
                "Review GI hormones, Digestion/Absorption",
                "Review Pituitary, Thyroid, Adrenal hormones",
                "Review Renal clearance, Acid-base balance",
                "Solve MCQs on hormonal regulation, physiological basis of diseases (Focus on PYQs)"
            ],
            estimatedTime: "3-4 hours",
            priority: "high",
            keywords: ["Physiology", "GIT Physiology", "Endocrine Physiology", "Renal Physiology", "GI Hormones", "Endocrine Hormones", "Renal Clearance", "Acid-Base", "PYQs"]
        },
        // Day 26
        {
            day: 26,
            subject: "Biochemistry",
            topic: "Metabolism, Molecular Biology (High-Yield)",
            subtopics: [
                "Carbohydrate, Lipid, Protein metabolism (key pathways, enzymes, regulation)",
                "DNA/RNA structure, Replication, Transcription, Translation basics",
                "Vitamins & Minerals"
            ],
            checklist: [
                "Review Carbohydrate, Lipid, Protein metabolism (key pathways, enzymes, regulation)",
                "Review DNA/RNA structure, Replication, Transcription, Translation basics",
                "Review Vitamins & Minerals",
                "Solve MCQs on rate-limiting enzymes, genetic disorders, vitamin deficiencies (Focus on PYQs)"
            ],
            estimatedTime: "3-4 hours",
            priority: "high",
            keywords: ["Biochemistry", "Metabolism", "Molecular Biology", "DNA", "RNA", "Vitamins", "Minerals", "PYQs"]
        },
        // Day 27
        {
            day: 27,
            subject: "Forensic Medicine & Toxicology",
            topic: "FMT Review",
            subtopics: [
                "Identification, Death changes, Asphyxia, Injuries",
                "Relevant IPC sections",
                "Common poisons (Organophosphates, Kerosene, Opioids, Alcohol)"
            ],
            checklist: [
                "Review Identification, Death changes, Asphyxia, Injuries",
                "Review relevant IPC sections",
                "Review Common poisons (Organophosphates, Kerosene, Opioids, Alcohol)",
                "Solve MCQs on legal aspects, signs of poisoning"
            ],
            estimatedTime: "3-4 hours",
            priority: "high",
            keywords: ["Forensic Medicine", "Toxicology", "Identification", "Death Changes", "Asphyxia", "Injuries", "IPC", "Poisons"]
        },
        // Day 28
        {
            day: 28,
            subject: "Assessment",
            topic: "Full-Length Mock Test 1",
            subtopics: [
                "Full-Length Mock Exam (200 questions, 3.5 hours)"
            ],
            checklist: [
                "Take a full-length mock exam under timed conditions",
                "Ensure exam simulation environment if possible"
            ],
            estimatedTime: "3-4 hours",
            priority: "critical",
            keywords: ["Mock Test", "Full-Length Test", "Assessment", "Exam Simulation"]
        },
        // Day 29
        {
            day: 29,
            subject: "Revision & Analysis",
            topic: "Mock Test 1 Analysis & Correction",
            subtopics: [
                "Detailed analysis of Mock Test 1",
                "Identification of silly mistakes, conceptual gaps, time management issues",
                "Targeted revision of topics with errors"
            ],
            checklist: [
                "Spend 3-4 hours analyzing Mock Test 1 performance",
                "Review every question (correct and incorrect)",
                "Update Special Improvise List based on weak areas",
                "Revise topics where errors were made"
            ],
            estimatedTime: "3-4 hours",
            priority: "critical",
            keywords: ["Revision", "Mock Analysis", "Targeted Revision", "Error Correction"]
        },
        // Day 30
        {
            day: 30,
            subject: "Final Review",
            topic: "Last Day Quick Revision",
            subtopics: [
                "Rapid revision of critical topics: images, values, formulas, drug of choice, latest guidelines",
                "Review own short notes, bookmarks, important PYQs"
            ],
            checklist: [
                "Quickly go through own short notes, important images, formulas",
                "Review PYQs marked as important",
                "Stay calm and positive. Do not study anything new.",
                "Get adequate sleep."
            ],
            estimatedTime: "3-4 hours",
            priority: "critical",
            keywords: ["Final Revision", "Rapid Review", "High-Yield Facts", "Exam Preparation"]
        } // No comma after the last item in the array
    ];

    // Function to get the plan for a specific day (1-indexed)
    const getDayPlan = (dayNumber) => {
        if (dayNumber < 1 || dayNumber > plan.length) {
            // If plan is shorter than 30 days, or dayNumber is out of bounds
            const actualDay = Math.min(Math.max(1, dayNumber), plan.length);
            return plan[actualDay - 1]; 
        }
        return plan[dayNumber - 1];
    };
    
    const getTotalDays = () => plan.length;

    // Placeholder for generating plan based on PYQ analysis (future enhancement)
    const generateIntelligentPlan = (pyqData) => {
        console.warn("Intelligent plan generation is not yet implemented. Using predefined plan.");
        // In a real scenario, this function would analyze PYQ data
        // to prioritize topics and structure the 30-day plan.
        return plan;
    };

    return {
        getDayPlan,
        getTotalDays,
        generateIntelligentPlan,
        // Expose the raw plan if needed elsewhere, though getDayPlan is preferred
        rawPlan: plan 
    };
})();