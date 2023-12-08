import React from 'react'
import { ROLE_TRAINER, ROLE_ADMIN } from './constants/constants'

const MedicalConditions = React.lazy(() =>
    import('./components/Admin/MedicalConfitions'),
)
const ActivityLevel = React.lazy(() =>
    import('./components/Admin/ActivityLevel'),
)
const TrainerVerification = React.lazy(() =>
    import('./components/Admin/TrainerVerificiation'),
)
const TrainerExpertise = React.lazy(() =>
    import('./components/Admin/TrainerExpertise'),
)
const CertificateName = React.lazy(() =>
    import('./components/Admin/CertificateName'),
)
const Equipment = React.lazy(() => import('./components/Admin/Equipment'))
const Exercise = React.lazy(() => import('./components/Admin/Exercise'))
const CardioForm = React.lazy(() => import('./components/Admin/CardioForm'))
const TrainerOnboarding = React.lazy(() =>
    import('./components/Trainer/TrainerOnboarding'),
)
const TrainerDashboard = React.lazy(() =>
    import('./components/Trainer/Dashboard'),
)
const Profile = React.lazy(() => import('./components/Profile'))
const PageNotFound = React.lazy(() =>
    import('./components/Common/ErrorPage/PageNotFound'),
)
// const InviteUserToken = React.lazy(() => import('./components/UserInviteToken'))

const Workout = React.lazy(() => import('./components/Trainer/Workout'))

const User = React.lazy(() => import('./components/User'))

const PrivacyPolicy = React.lazy(() =>
    import('./components/Terms/PrivacyPolicy'),
)
const TermsOfUse = React.lazy(() => import('./components/Terms/TermsOfUse'))

const SupportPage = React.lazy(() =>
    import('./components/LandingPage/SupportPage/index'),
)
const Tasks = React.lazy(() => import('./components/Tasks'))

const routes = [
    // User
    {
        path: '/user',
        exact: true,
        name: 'User',
        component: User,
        secure: false,
    },
    // {
    //     path: '/user/invite',
    //     exact: true,
    //     name: 'User Invite Token',
    //     component: InviteUserToken,
    //     secure: false,
    // },
    // Trainer
    {
        path: '/',
        exact: true,
        name: 'Trainer Dashboard',
        component: TrainerDashboard,
        secure: true,
    },
    {
        path: '/trainer-onboarding',
        exact: true,
        name: 'Trainer Onboarding',
        component: TrainerOnboarding,
        secure: true,
    },
    {
        path: '/workout/:id',
        exact: true,
        name: 'Workout',
        component: Workout,
        secure: true,
    },
    {
        path: '/workout/tasks/:id',
        exact: true,
        name: 'Tasks',
        component: Tasks,
        secure: true,
    },
    // // Admin
    // {
    //     path: '/admin/medical-condition',
    //     exact: true,
    //     name: 'Medical Condition Admin',
    //     component: MedicalConditions,
    //     role: [ROLE_ADMIN],
    // },
    // {
    //     path: '/admin/activity-level',
    //     exact: true,
    //     name: 'Activity Level Admin',
    //     component: ActivityLevel,
    //     role: [ROLE_ADMIN],
    // },
    // {
    //     path: '/admin/cardio-form',
    //     exact: true,
    //     name: 'Cardio Form Admin',
    //     component: CardioForm,
    //     role: [ROLE_ADMIN],
    // },
    // {
    //     path: '/admin/trainer-expertise',
    //     exact: true,
    //     name: 'Trainer Expertise Admin',
    //     component: TrainerExpertise,
    //     role: [ROLE_ADMIN],
    // },
    // {
    //     path: '/admin/equipment',
    //     exact: true,
    //     name: 'Equipment Admin',
    //     component: Equipment,
    //     role: [ROLE_ADMIN],
    // },
    // {
    //     path: '/admin/exercise',
    //     exact: true,
    //     name: 'Exercise Admin',
    //     component: Exercise,
    //     role: [ROLE_ADMIN],
    // },
    // {
    //     path: '/admin/certificate-name',
    //     exact: true,
    //     name: 'Certificate Name Admin',
    //     component: CertificateName,
    //     role: [ROLE_ADMIN],
    // },
    // {
    //     path: '/admin/trainer-verification',
    //     exact: true,
    //     name: 'Trainer Verification Admin',
    //     component: TrainerVerification,
    //     role: [ROLE_ADMIN],
    // },

    // Common
    {
        path: '/profile',
        exact: false,
        name: 'Main Page',
        component: Profile,
        secure: true,
    },

    // Terms
    {
        path: '/terms-of-use',
        exact: false,
        name: 'Terms Of Use',
        component: TermsOfUse,
    },
    {
        path: '/privacy-policy',
        exact: false,
        name: 'Privacy Policy',
        component: PrivacyPolicy,
    },
    {
        path: '/support',
        exact: false,
        name: 'Support',
        component: SupportPage,
    },

    {
        exact: false,
        name: '404',
        component: PageNotFound,
        secure: false,
    },
]

export default routes
