import React from 'react'
import ShadowContainer from '../../../Common/ShadowContainer'
import './index.scss'
import { Icon } from '@iconify/react'
import AccordionComponent from '../../../Common/AccordionComponent'

const SupportPage = () => {
    const data = [
        {
            parent: ' I don’t have a certification? Can I still use the Evolv App to train my clients?',
            child: 'Yes, even without a certification, you can onboard the platform as a coach and invite your existing clients to join the app under your coaching.',
        },
        {
            parent: 'I don’t have a certification? Will I be able to host my profile on the app marketplace to scale my business?',
            child: 'Currently, that won’t be possible as we would want all initial coaches to be certified.',
        },
        {
            parent: 'How will I collect payments from my clients using the app?',
            child: 'You can create your programs once your profile is verified, and in your programs, you can mention the cost which the client will pay through the app. Once we receive the payment, we will deposit the amount directly to your bank account according to your convenience.',
        },
        {
            parent: 'How many days will it take to get my profile verified?',
            child: 'We will try our best to verify it within 1-2 days, but due to high traffic, it might take 3-5 working  days. Still you can start making your programs and complete your profile before the verification.',
        },
        {
            parent: 'How do I make money on your platform as a coach?',
            child: 'As of now there are 3 ways through which you can generate revenue.\t \n 1. Get more clients from the marketplace \t \n 2. Create and sell template plans to your following \t \n 3. Earn commission on the products from our online store',
        },
        {
            parent: 'How do I create a workout program for my client?',
            child: 'Once you are onboarded as a trainer, you can add your clients by inviting them through their email and then you can go to their workout page and then create a workout cycle that will be repeated weekly. Once you create the cycle, you can add the workout and rest days according to your client’s needs. After adding the days, you can name them and the exercises, sets, reps, load and effort accordingly. Once your cycle is ready, you can assign it to your client.',
        },
    ]
    return (
        <div className="support-container">
            <p className="heading">Support</p>
            <div className="faq">
                <p>Frequently asked parents</p>
                {data?.map((item, index) => (
                    <AccordionComponent key={index} data={item} />
                ))}
            </div>
            <p>Contact Support</p>
            <div className="contact">
                <div className="support-container">
                    <Icon
                        icon={'ant-design:phone-outlined'}
                        height={24}
                        className="icon"
                    />
                    <div>
                        <a href="tel:+919334444441">
                            <p>+91 - 9334444441</p>
                        </a>
                        <a href="tel:+918290939833">
                            <p>+91 - 8290939833</p>
                        </a>
                    </div>
                </div>
                <div className="support-container">
                    <Icon icon={'charm:mail'} height={24} className="icon" />
                    <div>
                        <a href="mailto: contact@evolvfit.in">
                            <p>contact@evolvfit.in</p>
                        </a>
                        <a href="mailto: evolv.contact@gmail.com">
                            <p>evolv.contact@gmail.com</p>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SupportPage
