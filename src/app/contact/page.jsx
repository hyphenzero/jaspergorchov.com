import Link from 'next/link'

import { ContactForm } from '@/components/ContactForm'
import { Container } from '@/components/Container'
import { CurrentTime } from '@/components/CurrentTime'
import { FadeIn } from '@/components/FadeIn'
import { PageIntro } from '@/components/PageIntro'
import { SocialMedia } from '@/components/SocialMedia'
import { TagListItem } from '@/components/TagList'

export const available = false

function ContactDetails() {
  return (
    <div>
      <h2 className="font-display text-base font-semibold text-white">
        My details
      </h2>
      <p className="mt-6 text-base text-neutral-400">
        Contact me any way you like — I’ll get back to you as soon as I can.
      </p>

      <div className="mt-6 flex items-center gap-x-6">
        <strong className="font-semibold text-white">Status:</strong>
        <TagListItem
          as="div"
          className="flex w-fit space-x-3 rounded-full bg-white px-4 py-1 font-medium text-primary shadow"
        >
          {available ? 'Available for new work' : 'Not available for new work'}
        </TagListItem>
      </div>

      <div className="mt-16 border-t border-neutral-800 pt-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <h2 className="font-display text-base font-semibold text-white">
              Email
            </h2>
            <div className="mt-6 text-sm">
              <p className="w-fit text-neutral-400">
                <Link
                  href="mailto:hello@jaspergorchov.com"
                  className="transition-colors duration-200 hover:text-sky-300"
                >
                  hello@jaspergorchov.com
                </Link>
              </p>
            </div>
          </div>
          <div>
            <h2 className="font-display text-base font-semibold text-white">
              Timezone
            </h2>
            <div className="mt-6 text-sm">
              <p className="w-fit text-neutral-400">
                <CurrentTime />
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-neutral-800 pt-16">
        <h2 className="font-display text-base font-semibold text-white">
          Follow me
        </h2>
        <SocialMedia className="mt-6" />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Contact',
  description: available
    ? 'Let’s talk — I’ll get back to you as soon a I can.'
    : 'Let’s work together — I’m always looking for new opportunities.',
}

export default function Contact() {
  return (
    <FadeIn>
      <PageIntro
        eyebrow="Contact"
        title={available ? 'Let’s work together' : 'Let’s talk'}
        fadeIn={false}
      >
        {available ? (
          <p>I’m always looking for new opportunities.</p>
        ) : (
          <p>
            While I’m not currently available for new work, you can still feel
            free to say hi!
          </p>
        )}
      </PageIntro>

      <Container className="mt-24 sm:mt-32 lg:mt-40">
        <div className="grid grid-cols-1 gap-x-8 gap-y-24 lg:grid-cols-2">
          <ContactForm available={available} />
          <ContactDetails />
        </div>
      </Container>
    </FadeIn>
  )
}
