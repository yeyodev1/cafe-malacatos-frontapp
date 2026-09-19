<script setup lang="ts">
import { ref } from 'vue'
import { site } from '@/config/site'
import { useStoryMotion } from '@/composables/useStoryMotion'
import StoryMedia from '@/components/home/StoryMedia.vue'

const root = ref<HTMLElement | null>(null)
const steps = site.story.steps

// El icono es el respaldo de un capítulo sin video configurado en site.story.steps.
const icons: Record<string, string> = {
  origen: 'fa-solid fa-mountain-sun',
  tueste: 'fa-solid fa-fire-flame-curved',
  taza: 'fa-solid fa-mug-hot',
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

useStoryMotion(root, 'story--pinned')
</script>

<template>
  <section id="historia" ref="root" class="story" aria-labelledby="story-title">
    <header class="story__head">
      <p class="story__eyebrow" data-reveal>{{ site.story.eyebrow }}</p>
      <h2 id="story-title" class="story__title" data-reveal>{{ site.story.title }}</h2>
      <p class="story__intro" data-reveal>{{ site.story.intro }}</p>
    </header>

    <div class="story__stage" data-story-stage>
      <ol class="story__chapters">
        <li v-for="(step, index) in steps" :key="step.key" class="chapter" data-chapter>
          <div
            class="chapter__media"
            :class="`chapter__media--${step.key}`"
            :data-media="step.key"
            data-chapter-media
            aria-hidden="true"
          >
            <span class="chapter__number">{{ pad(index + 1) }}</span>
            <StoryMedia v-if="step.video" :video="step.video" :poster="step.poster" />
            <i v-else class="chapter__icon" :class="icons[step.key]"></i>
          </div>

          <div class="chapter__body" data-chapter-body>
            <p class="chapter__count">{{ pad(index + 1) }} / {{ pad(steps.length) }}</p>
            <h3 class="chapter__title">{{ step.title }}</h3>
            <p class="chapter__text">{{ step.text }}</p>
          </div>
        </li>
      </ol>

      <div class="story__progress" aria-hidden="true">
        <div class="story__rail"><span class="story__bar" data-story-bar></span></div>
        <ul class="story__labels">
          <li v-for="(step, index) in steps" :key="step.key" data-story-label>
            <span>{{ pad(index + 1) }}</span> {{ step.title }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.story {
  background: $roast;
  color: $paper;
  padding-block: $space-section;
  scroll-margin-top: 4rem;

  &__head {
    @include container(820px);
    @include flex(column, center, flex-start, 1rem);
    text-align: center;
    margin-bottom: $space-lg;
  }

  &__eyebrow {
    @include eyebrow;
    color: $gold;
  }

  &__title {
    @include display($display-md);
  }

  &__intro {
    font-size: $text-lg;
    color: rgba($paper, 0.75);
    max-width: 58ch;
  }

  &__stage {
    @include container;
  }

  &__chapters {
    @include flex(column, stretch, flex-start, 3rem);
    list-style: none;
  }

  // La barra y las etiquetas solo tienen sentido con el recorrido fijado.
  &__progress {
    display: none;
  }

  &__rail {
    height: 2px;
    background: rgba($paper, 0.15);
    overflow: hidden;
  }

  &__bar {
    display: block;
    height: 100%;
    background: linear-gradient(90deg, $gold-deep, $gold, $gold-soft);
    transform-origin: left center;
    will-change: transform;
  }

  &__labels {
    @include flex(row, center, space-between, 1rem);
    @include eyebrow;
    list-style: none;
    margin-top: 1rem;
    color: $paper;

    li {
      flex: 1;
    }

    span {
      color: $gold;
      margin-right: 0.5rem;
    }
  }
}

.chapter {
  @include flex(column, stretch, flex-start, 1.5rem);

  // Sin pin (tablet, movimiento reducido): media y texto lado a lado, alternando.
  @include from('md') {
    flex-direction: row;
    align-items: center;
    gap: 3rem;

    &:nth-child(even) {
      flex-direction: row-reverse;
    }
  }

  &__media {
    position: relative;
    flex: 1 1 52%;
    @include flex(row, center, center);
    aspect-ratio: 4 / 3;
    border-radius: $radius-md;
    overflow: hidden;
    isolation: isolate;
    will-change: transform, opacity;

    &--origen {
      background:
        radial-gradient(80% 70% at 75% 15%, rgba($gold, 0.55), transparent 65%),
        linear-gradient(160deg, $accent 0%, $roast-soft 85%);
    }

    &--tueste {
      background:
        radial-gradient(70% 70% at 50% 100%, rgba($gold, 0.6), transparent 70%),
        linear-gradient(200deg, $accent-deep 0%, $roast-soft 80%);
    }

    &--taza {
      background:
        radial-gradient(60% 60% at 25% 25%, rgba($gold-soft, 0.45), transparent 70%),
        linear-gradient(140deg, $gold-deep 0%, $accent 55%, $roast-soft 100%);
    }
  }

  &__number {
    position: absolute;
    left: 1.25rem;
    bottom: 0.5rem;
    z-index: -1;
    @include display(clamp(5rem, 22vw, 11rem), 400);
    font-style: italic;
    color: rgba($paper, 0.14);
  }

  &__icon {
    font-size: clamp(2.5rem, 8vw, 4.5rem);
    color: rgba($paper, 0.85);
  }

  &__body {
    @include flex(column, flex-start, flex-start, 0.75rem);
    flex: 1 1 42%;
    will-change: transform, opacity;
  }

  &__count {
    @include eyebrow;
    color: $gold;
  }

  &__title {
    @include display($display-sm);
  }

  &__text {
    font-size: $text-lg;
    color: rgba($paper, 0.78);
    max-width: 40ch;
  }
}

// Recorrido fijado (solo escritorio, lo activa useStoryMotion).
.story--pinned {
  padding-bottom: 0;

  .story__stage {
    @include flex(column, stretch, center, 2rem);
    height: 100vh;
    padding-block: 5.5rem 2.5rem;
  }

  .story__chapters {
    position: relative;
    flex: 1;
    min-height: 0;
  }

  .story__progress {
    display: block;
  }

  .chapter,
  .chapter:nth-child(even) {
    position: absolute;
    inset: 0;
    flex-direction: row;
    gap: 4rem;
  }

  .chapter {
    &__media {
      height: 100%;
      aspect-ratio: auto;
    }

    &__title {
      font-size: $display-md;
    }

    &__count {
      display: none;
    }
  }
}
</style>
