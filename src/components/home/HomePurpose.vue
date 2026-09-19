<script setup lang="ts">
import { ref } from 'vue'
import { site } from '@/config/site'
import { copy } from '@/config/copy'
import { useWordScrub } from '@/composables/useWordScrub'

const root = ref<HTMLElement | null>(null)

const blocks = [site.mission, site.vision].map((block) => ({
  title: block.title,
  words: block.text.split(' '),
}))

useWordScrub(root)
</script>

<template>
  <section ref="root" class="purpose" aria-labelledby="purpose-title">
    <div class="purpose__inner">
      <header class="purpose__head">
        <p class="purpose__eyebrow" data-reveal>{{ copy.home.purpose.eyebrow }}</p>
        <h2 id="purpose-title" class="visually-hidden">{{ copy.home.purpose.title }}</h2>
      </header>

      <article v-for="block in blocks" :key="block.title" class="purpose__block">
        <h3 class="purpose__title" data-reveal>{{ block.title }}</h3>
        <!-- Cada palabra va en un span solo para el efecto; el espacio entre spans mantiene el texto legible. -->
        <p class="purpose__text" data-words>
          <template v-for="(word, index) in block.words" :key="index">
            <span data-word>{{ word }}</span
            >{{ ' ' }}
          </template>
        </p>
      </article>
    </div>
  </section>
</template>

<style scoped lang="scss">
.purpose {
  background: radial-gradient(60% 50% at 100% 0%, rgba($gold, 0.16), transparent 70%), $accent-deep;
  color: $paper;
  padding-block: $space-section;

  &__inner {
    @include container(1040px);
    @include flex(column, stretch, flex-start, $space-lg);
  }

  &__eyebrow {
    @include eyebrow;
    color: $gold;
  }

  &__block {
    @include flex(column, flex-start, flex-start, 1rem);

    @include from('lg') {
      flex-direction: row;
      gap: 3rem;
    }
  }

  &__title {
    @include display($display-sm, 500);
    font-style: italic;
    color: $gold;

    @include from('lg') {
      flex: 0 0 9rem;
      padding-top: 0.35rem;
    }
  }

  &__text {
    @include display(clamp(1.35rem, 1rem + 1.9vw, 2.5rem), 400);
    line-height: 1.28;
    letter-spacing: -0.01em;
    text-wrap: pretty;
  }
}
</style>
