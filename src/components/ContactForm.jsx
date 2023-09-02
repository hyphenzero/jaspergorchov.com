'use client'

import { useId } from 'react'

import { FadeIn } from './FadeIn'
import { Button } from './Button'

function TextInput({ label, ...props }) {
  let id = useId()

  return (
    <div className="group relative z-0 transition-all focus-within:z-10">
      <input
        type="text"
        id={id}
        {...props}
        placeholder=" "
        className="peer block w-full border border-neutral-800 bg-transparent px-6 pb-4 pt-12 text-base/6 text-neutral-400 transition focus:border-white focus:outline-none focus:ring-0 group-first:rounded-t-2xl group-last:rounded-b-2xl"
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-6 top-1/2 -mt-3 origin-left text-base/6 text-neutral-400 transition-all duration-200 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-white peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-white"
      >
        {label}
      </label>
    </div>
  )
}

function TextArea({ label, ...props }) {
  let id = useId()

  return (
    <div className="group relative z-0 transition-all focus-within:z-10">
      <div className="pointer-events-none absolute top-px ml-[1px] flex h-12 w-[calc(100%-2px)] justify-center bg-gradient-to-b from-neutral-912 group-first:rounded-t-2xl group-last:rounded-b-2xl" />
      <textarea
        id={id}
        {...props}
        placeholder=" "
        className="peer block h-64 w-full border border-neutral-800 bg-transparent px-6 pb-6 pt-12 text-base/6 text-neutral-400 transition focus:border-white focus:outline-none focus:ring-0 group-first:rounded-t-2xl group-last:rounded-b-2xl"
      ></textarea>
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-6 top-12 -mt-3 origin-left text-base/6 text-neutral-400 transition-all duration-200 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-white peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-white"
      >
        {label}
      </label>
    </div>
  )
}

function RadioInput({ label, ...props }) {
  return (
    <label className="flex gap-x-3">
      <input
        type="radio"
        {...props}
        className="h-6 w-6 rounded-full border border-neutral-800 bg-white outline-none checked:border-[0.5rem] checked:border-white focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-offset-2"
      />
      <span className="text-base/6 text-white">{label}</span>
    </label>
  )
}

export function ContactForm({ available }) {
  function handleSubmit(e) {
    e.preventDefault()

    const name = e.target.name.value
    const email = e.target.email.value
    const company = e.target.company.value
    const subject = e.target.subject.value
    let budget = null
    if (available) {
      budget = e.target.budget.value
    }

    const mailtoUrl = `mailto:hello@jaspergorchov.com?subject=${subject}&body=Hello,%20Jasper!%0D%0D%09I’m%20${name},%20and%20I%20work%20with%20${company}.%20I’m%20writing%20to%20you%20about%20${subject}.%0D%0DThanks,%0D${name}%0D${email}`

    window.location.href = mailtoUrl
  }

  return (
    <FadeIn className="lg:order-last">
      <form onSubmit={handleSubmit}>
        <h2 className="font-display text-base font-semibold text-white">
          Email me
        </h2>
        <div className="isolate mt-6 -space-y-px rounded-2xl bg-neutral-912">
          <TextInput label="Name" name="name" autoComplete="name" required />
          <TextInput
            label="Email Address"
            type="email"
            name="email"
            autoComplete="email"
            required
          />
          <TextInput
            label="Company"
            name="company"
            autoComplete="organization"
          />
          <TextInput label="Subject" name="subject" required />
          {available && (
            <div className="border border-neutral-800 px-6 py-8 first:rounded-t-2xl last:rounded-b-2xl">
              <fieldset>
                <legend className="text-base/6 text-neutral-400">Budget</legend>
                <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <RadioInput label="$25K – $50K" name="budget" value="25" />
                  <RadioInput label="$50K – $100K" name="budget" value="50" />
                  <RadioInput label="$100K – $150K" name="budget" value="100" />
                  <RadioInput
                    label="More than $150K"
                    name="budget"
                    value="150"
                  />
                </div>
              </fieldset>
            </div>
          )}
        </div>
        <Button type="submit" className="mt-10">
          Compose Email
        </Button>
      </form>
    </FadeIn>
  )
}
