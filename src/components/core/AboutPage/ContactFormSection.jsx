import React from 'react'
import ContactForm from '../../ContactPage/ContactForm'

const ContactFormSection = () => {
  return (
    <div className='mx-auto'>
        <h1 className='text-4xl text-center font-semibold'>
            Get in Touch
        </h1>
        <p className='text-center text-richblack-300 mt-3'>
            We'd love to hear for you, Please fill out this form.
        </p>
        <div className='mt-12 mx-auto'>
            <ContactForm/>
        </div>
    </div>
  )
}

export default ContactFormSection