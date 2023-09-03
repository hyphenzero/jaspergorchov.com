'use client'

import Image from 'next/image'

import { Tab } from '@headlessui/react'
import {
  CubeIcon,
  RectangleGroupIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid'
import clsx from 'clsx'

import { FadeIn, FadeInStagger } from './FadeIn'
import { Section } from '@/components/Section'
import imageExperiences from 'src/app/playground/refractions/closeup-1.png'
import imageDevelopment from 'src/app/work/chatgpt-redesign/settings.png'
import image3D from 'src/app/work/compositions-1/hero.png'

const services = [
  {
    name: '3D Design',
    description:
      'Infusing semi-abstract scenes with semi-realistic elements, resulting in a dynamic and modern style.',
    image: image3D,
    icon: CubeIcon,
  },
  {
    name: 'Web Development',
    description:
      'Crafting modern and user-centric UIs with an innovative approach to enhance user experience and overall feel.',
    image: imageDevelopment,
    icon: RectangleGroupIcon,
  },
  {
    name: 'Digital Experiences',
    description:
      'Combining powerful elements of UI design with high-quality 3D art to form the next generation of interactive digital experiences.',
    image: imageExperiences,
    icon: UserCircleIcon,
  },
]

function Service({ service, isActive, className, ...props }) {
  return (
    <div
      className={clsx(
        className,
        !isActive && 'opacity-75 transition duration-200 hover:opacity-100',
      )}
      {...props}
    >
      <div className="w-fit rounded-full bg-white p-3 text-neutral-912">
        <service.icon className="h-7 w-7" />
      </div>
      <h3 className="mt-6 text-left font-display text-xl font-semibold text-white">
        {service.name}
      </h3>
      <p className="mt-2 text-left text-sm text-neutral-400">
        {service.description}
      </p>
    </div>
  )
}

function ServicesMobile() {
  return (
    <div className="flex flex-col gap-y-20 overflow-hidden md:hidden">
      {services.map((service) => (
        <div key={service.name}>
          <Service service={service} className="mx-auto max-w-2xl" isActive />
          <div className="relative mt-10 pb-10">
            <div className="absolute -inset-x-4 bottom-0 top-8 sm:-inset-x-6" />
            <div className="relative aspect-[16/10] h-auto w-full overflow-clip rounded-xl shadow-xl">
              <Image
                className="object-cover"
                src={service.image}
                alt=""
                fill
                unoptimized
              />
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ServicesDesktop() {
  return (
    <Tab.Group as="div" className="hidden md:mt-20 md:block">
      {({ selectedIndex }) => (
        <>
          <Tab.List>
            <FadeInStagger faster className="grid grid-cols-3 gap-x-12">
              {services.map((service, serviceIndex) => (
                <FadeIn key={service.name}>
                  <Service
                    service={{
                      ...service,
                      name: (
                        <Tab className="ui-not-focus-visible:outline-none">
                          <span className="absolute inset-0" />
                          {service.name}
                        </Tab>
                      ),
                    }}
                    isActive={serviceIndex === selectedIndex}
                    className="relative"
                  />
                </FadeIn>
              ))}
            </FadeInStagger>
          </Tab.List>
          <FadeIn
            as="Tab.Panels"
            className="relative mt-20 flex gap-12 overflow-hidden rounded-3xl border-b border-neutral-900 bg-neutral-950 p-16 shadow-inner shadow-black/25"
          >
            {services.map((service, serviceIndex) => (
              <Tab.Panel
                static
                key={service.name}
                className={clsx(
                  'transition duration-500 ease-in-out ui-not-focus-visible:outline-none',
                  serviceIndex !== selectedIndex && 'opacity-60 grayscale',
                )}
                style={{
                  transform: `translateX(calc(${selectedIndex * -844}px + ${
                    selectedIndex * -48
                  }px`,
                }}
                aria-hidden={serviceIndex !== selectedIndex}
              >
                <div className="relative aspect-[3/2] h-auto w-[52.75rem] overflow-clip rounded-xl shadow-xl">
                  <Image
                    className="object-cover"
                    src={service.image}
                    alt=""
                    fill
                    unoptimized
                  />
                  <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
                </div>
              </Tab.Panel>
            ))}
          </FadeIn>
        </>
      )}
    </Tab.Group>
  )
}

export function ServicesDetail() {
  return (
    <Section>
      <ServicesMobile />
      <ServicesDesktop />
    </Section>
  )
}
