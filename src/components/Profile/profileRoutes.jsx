import React from 'react'
// const AddFoodItem = React.lazy(() => import('./Components/AddFoodItem'))
const FoodItems = React.lazy(() => import('./Components/AddFoodItem/FoodItem'))
const AccountDetails = React.lazy(() => import('./Components/Account'))
const Personal = React.lazy(() => import('./Components/Personal'))
const ProfileTab = React.lazy(() => import('./Components/ProfileTab'))
const ProgramsPage = React.lazy(() => import('./Components/Programs'))
const SupportPage = React.lazy(() => import('./Components/Support'))
const ViewExercise = React.lazy(() => import('./Components/Exercises'))
const PaymentsPage = React.lazy(() => import('./Components/Payments'))
// const AddExercise = React.lazy(() =>
//     import('../Profile/Components/AddExercise'),
// )

const routes = [
    {
        path: 'personal',
        exact: true,
        component: Personal,
        name: 'Personal',
        icon: 'la:id-card',
    },
    {
        path: 'profile',
        exact: true,
        component: ProfileTab,
        name: 'Profile',
        icon: 'bi:person-fill',
    },
    {
        path: 'programs',
        exact: true,
        component: ProgramsPage,
        name: 'Programs',
        icon: 'ant-design:schedule-filled',
    },
    {
        path: 'support',
        exact: true,
        component: SupportPage,
        name: 'Support',
        icon: 'bx:support',
    },
    {
        path: 'viewExercise',
        exact: true,
        // component: AddExercise,
        component: ViewExercise,
        name: 'Exercise',
        icon: 'material-symbols:exercise',
    },
    {
        path: 'addNewFood',
        exact: true,
        // component: AddFoodItem,
        component: FoodItems,
        name: 'Food Item',
        icon: 'bx:support',
    },
    {
        path: 'payments',
        exact: true,
        component: PaymentsPage,
        name: 'Payments',
        icon: 'bi-wallet-fill',
    },
]

export default routes
