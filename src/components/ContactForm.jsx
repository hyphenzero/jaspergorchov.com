'use client'

import { useId, useState } from 'react'

import { Tab } from '@headlessui/react'
import clsx from 'clsx'

import { Button } from './Button'

function TextInput({ label, required, ...props }) {
  let id = useId()

  return (
    <div className="group relative z-0 focus-within:z-10">
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
  const [formContent, setFormContent] = useState({
    name: '',
    email: '',
    job_title: '',
    company: '',
    subject: '',
  })

  function handleWorkSubmit(e) {
    e.preventDefault()

    const { name, job_title, company, subject } = formContent

    const intro =
      job_title.trim() !== ''
        ? `I’m ${name}, a ${job_title} at ${company}.`
        : `I’m ${name}, and I work with ${company}.`

    const mailtoUrl = `mailto:hello@jaspergorchov.com?subject=${subject}&body=${encodeURIComponent(
      `Hello, Jasper!\n\n\t${intro} I’m writing to you about ${subject.toLowerCase()}.\n\n\t...\n\nThanks,\n${name}`,
    )}`

    window.location.href = mailtoUrl
  }

  function handleGeneralSubmit(e) {
    e.preventDefault()

    const { name, subject } = formContent

    const mailtoUrl = `mailto:hello@jaspergorchov.com?subject=${subject}&body=${encodeURIComponent(
      `Hello, Jasper!\n\n\tI’m ${name}, and I’m writing to you about ${subject.toLowerCase()}.\n\n\t...\n\nThanks,\n${name}`,
    )}`

    window.location.href = mailtoUrl
  }

  function handleFieldChange(e) {
    const { name, value } = e.target

    setFormContent({
      ...formContent,
      [name]: value,
    })
  }

  const isFormFilled = Object.values(formContent).some(
    (value) => value.trim() !== '',
  )

  function renderFieldOrPlaceholder(field, placeholderText) {
    return field.trim() !== '' ? (
      <span className="text-white font-medium">{field}</span>
    ) : (
      <div className="inline-flex rounded-md mx-0.5 bg-neutral-800 px-2 text-white font-medium">
        {placeholderText}
      </div>
    )
  }

  const workEmailPreview = (
    <>
      Hello, Jasper!
      <br />
      <br />
      &emsp;I’m {renderFieldOrPlaceholder(formContent.name, 'Name')}, a{' '}
      {renderFieldOrPlaceholder(formContent.job_title, 'Job Title')} at{' '}
      {renderFieldOrPlaceholder(formContent.company, 'Company')}. I’m writing to
      you about{' '}
      <span className="lowercase">
        {renderFieldOrPlaceholder(formContent.subject, 'Subject')}
      </span>
      .
      <br />
      <br />
      &emsp;...
      <br />
      <br />
      Thanks,
      <br />
      {renderFieldOrPlaceholder(formContent.name, 'Name')}
    </>
  )

  const generalEmailPreview = (
    <>
      Hello, Jasper!
      <br />
      <br />
      &emsp;I’m {renderFieldOrPlaceholder(formContent.name, 'Name')}, and I’m
      writing to you about{' '}
      <span className="lowercase">
        {renderFieldOrPlaceholder(formContent.subject, 'Subject')}
      </span>
      .
      <br />
      <br />
      &emsp;...
      <br />
      <br />
      Thanks,
      <br />
      {renderFieldOrPlaceholder(formContent.name, 'Name')}
    </>
  )

  return (
    <div className="lg:order-last">
      <Tab.Group>
        <div className="flex w-full justify-between items-center">
          <h2 className="font-display text-base font-semibold text-white">
            Email me
          </h2>

          <Tab.List className="flex space-x-1 rounded-xl bg-neutral-900 p-1">
            <Tab
              disabled={!available}
              className={clsx(
                'text-sm font-semibold font-display ui-selected:bg-white rounded-lg ui-selected:text-primary px-5 py-1  ui-not-selected:text-neutral-400',
                available
                  ? 'ui-not-selected:hover:bg-neutral-800'
                  : 'cursor-not-allowed',
              )}
            >
              Work inquiries
            </Tab>
            <Tab className="text-sm font-semibold font-display ui-selected:bg-white rounded-lg ui-selected:text-primary px-5 py-1 ui-not-selected:text-neutral-400 ui-not-selected:hover:bg-neutral-800">
              General
            </Tab>
          </Tab.List>
        </div>

        <Tab.Panels>
          <Tab.Panel>
            <div
              aria-hidden="true"
              className="mt-6 rounded-2xl p-6 border bg-secondary border-white text-neutral-400"
            >
              <p className="text-base/6">
                {isFormFilled ? (
                  workEmailPreview
                ) : (
                  <span className="flex items-center justify-center text-center h-48">
                    Fill out the form to generate an email.
                  </span>
                )}
              </p>
            </div>

            <form onSubmit={handleWorkSubmit}>
              <div className="isolate mt-6 -space-y-px rounded-2xl bg-secondary">
                <TextInput
                  label="Subject"
                  name="subject"
                  required
                  onChange={handleFieldChange}
                />
                <TextInput
                  label="Name"
                  name="name"
                  autoComplete="name"
                  required
                  onChange={handleFieldChange}
                />
                <TextInput
                  label="Job Title"
                  name="job_title"
                  onChange={handleFieldChange}
                />
                <TextInput
                  label="Company"
                  name="company"
                  autoComplete="organization"
                  required
                  onChange={handleFieldChange}
                />
                {available && (
                  <div className="border border-neutral-800 px-6 py-8 first:rounded-t-2xl last:rounded-b-2xl">
                    <fieldset>
                      <legend className="text-base/6 text-neutral-400">
                        Budget
                      </legend>
                      <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
                        <RadioInput
                          label="$25K – $50K"
                          name="budget"
                          value="25"
                        />
                        <RadioInput
                          label="$50K – $100K"
                          name="budget"
                          value="50"
                        />
                        <RadioInput
                          label="$100K – $150K"
                          name="budget"
                          value="100"
                        />
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
              <Button arrow type="submit" className="mt-10">
                Compose Email
              </Button>
            </form>
          </Tab.Panel>
          <Tab.Panel>
            <div
              aria-hidden="true"
              className="mt-6 rounded-2xl p-6 border bg-secondary border-white text-neutral-400"
            >
              <p className="text-base/6">
                {isFormFilled ? (
                  generalEmailPreview
                ) : (
                  <span className="flex items-center justify-center text-center h-48">
                    Fill out the form to generate an email.
                  </span>
                )}
              </p>
            </div>

            <form onSubmit={handleGeneralSubmit}>
              <div className="isolate mt-6 -space-y-px rounded-2xl bg-secondary">
                <TextInput
                  label="Subject"
                  name="subject"
                  required
                  onChange={handleFieldChange}
                />
                <TextInput
                  label="Name"
                  name="name"
                  autoComplete="name"
                  required
                  onChange={handleFieldChange}
                />
              </div>
              <Button arrow type="submit" className="mt-10">
                Compose Email
              </Button>
            </form>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}
