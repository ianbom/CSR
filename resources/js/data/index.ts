// Data Index File
// Import semua data JSON dari folder ini
// Nanti ketika backend siap, ganti import JSON dengan fetch API

import createProjectData from './createProject.json';
import ikmData from './ikmData.json';
import projectDetailData from './projectDetail.json';
import projectsData from './projects.json';
import sloiData from './sloiData.json';
import sroiData from './sroiData.json';

// Export all data
export {
    createProjectData,
    ikmData,
    projectDetailData,
    projectsData,
    sloiData,
    sroiData,
};

// Types untuk data
export interface Project {
    id: string;
    code: string;
    name: string;
    type: 'IKM' | 'SLOI' | 'SROI';
    typeLabel: string;
    location: string;
    status: 'active' | 'draft' | 'closed';
    currentResponses: number;
    targetResponses: number;
}

export interface ProjectDetail {
    id: string;
    name: string;
    description: string;
    status: string;
    currentResponses: number;
    targetResponses: number;
    ikmScore: number;
    ikmTrend: string;
    sloiLevel: string;
    sloiProgress: number;
    sroiRatio: string;
}

export interface Submission {
    id: string;
    dateTime: string;
    respondentType: string;
    impactScore: number;
    status: 'verified' | 'pending';
}

export interface IKMAuditLog {
    time: string;
    enumerator: string;
    enumeratorId: string;
    respondent: string;
    avgScore: number;
    status: 'verified' | 'pending';
    photoUrl: string;
    location: { lat: number; lng: number };
}

export interface SLOIAuditLog {
    id: string;
    group: 'csr' | 'general';
    date: string;
    score: number;
    status: 'verified' | 'pending';
    respondentName: string;
    enumerator: string;
}

export interface SROIOutcome {
    id: string;
    name: string;
    value: number;
    valueFormatted: string;
    type: 'financial' | 'social' | 'environmental';
    description: string;
    beneficiaries: number;
}

export interface AssessmentType {
    id: string;
    icon: string;
    title: string;
    description: string;
}
