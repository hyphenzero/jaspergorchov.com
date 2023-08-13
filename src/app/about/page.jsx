import { Container } from '@/components/Container'
import { PageIntro } from '@/components/PageIntro'
import { FadeIn, FadeInStagger } from '@/components/FadeIn'

export default function About() {
  return (
    <>
      <PageIntro eyebrow="About" title="Hi, I’m Jasper">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
          quidem consequuntur debitis error esse voluptatem numquam unde quod
          perferendis amet. Asperiores in nobis corporis ipsa blanditiis odit,
          pariatur facere vitae!
        </p>
        <div className="mt-10 max-w-2xl space-y-6 text-base">
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ullam
            maiores officiis, corrupti, libero inventore enim ex sint cupiditate
            culpa expedita quis eum, reprehenderit dolores nisi? Nihil
            voluptatem molestiae eum architecto cumque animi tenetur
            voluptatibus, sapiente dignissimos corporis ad debitis, quibusdam
            soluta cupiditate esse optio. Iste quam cum aspernatur
            exercitationem error.
          </p>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloremque
            vitae modi debitis facilis pariatur possimus cumque quas suscipit,
            repudiandae deleniti accusamus quod molestias libero sit ullam
            perspiciatis animi, eligendi labore veniam sunt saepe magnam quos
            ducimus nihil. Eius, quam a nulla eveniet amet velit. Vitae
            voluptatum, est quaerat ipsum obcaecati inventore iusto.
          </p>
        </div>
      </PageIntro>
    </>
  )
}
