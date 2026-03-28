import { useState } from 'react'
import './FAQ.css'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "Can I transfer my photos from Google or Apple?",
      answer: "Yes! We have a simple migration process from both Google and Apple. Just takeout your data, and drop it into our Desktop app and you are set!"
    },
    {
      question: "Does Savety have an app for my device?",
      answer: "Savety is available across multiple platforms including iOS, Android, and Desktop (Windows, macOS). You can access your memories anywhere."
    },
    {
      question: "How can I share my photos with end-to-end encryption?",
      answer: "By default, every photo you share is encrypted end-to-end. Your data remains yours, and only the people you share with can see them."
    },
    {
      question: "Can I share my subscription with family and friends?",
      answer: "Yes! Our family plans allow you to share your subscription with up to 5 other members at no extra cost, keeping everyone's data private."
    },
    {
      question: "What does \"Savety\" mean?",
      answer: "Savety stands for Safety and Preservation of your memories. We are dedicated to keeping your digital life secure and accessible."
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="faq-section">
      <h1 className="faq-title">FAQs</h1>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`faq-item ${openIndex === index ? 'open' : ''}`}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq-question">
              <span>{faq.question}</span>
              <span className="faq-icon">{openIndex === index ? '×' : '+'}</span>
            </div>
            {openIndex === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="faq-footer">
        <button className="btn btn-primary pill">See all FAQs</button>
      </div>
    </section>
  )
}

export default FAQ
