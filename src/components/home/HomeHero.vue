<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { site } from '@/config/site'
import { copy } from '@/config/copy'
import { cldSrcset, cldUrl } from '@/utils/image'
import { refreshScroll } from '@/composables/useMotion'
import { useHeroMediaMotion, useHeroMotion } from '@/composables/useHeroMotion'
import BaseCta from '@/components/ui/BaseCta.vue'
import HeroBeans from './HeroBeans.vue'
import HeroSeal from './HeroSeal.vue'

// Portada del primer producto publicado; sin ella, el hero es tipográfico.
const props = defineProps<{ image: string | null }>()

const root = ref<HTMLElement | null>(null)
const words = computed(() => site.hero.title.split(' '))

const visual = ref<HTMLElement | null>(null)

useHeroMotion(root)
const media = useHeroMediaMotion(root, visual)
watch(
  () => props.image,
  () => nextTick(media.rebuild),
)
</script>

<template>
  <section ref="root" class="hero" aria-labelledby="hero-title">
    <div class="hero__glow" aria-hidden="true"></div>

    <HeroBeans />

    <div class="hero__inner">
      <div class="hero__content" data-hero-content>
        <p class="hero__eyebrow" data-hero-fade>
          <span class="hero__eyebrow-line" aria-hidden="true"></span>{{ site.hero.eyebrow }}
        </p>

        <h1 id="hero-title" class="hero__title" :aria-label="site.hero.title">
          <template v-for="(word, index) in words" :key="index">
            <span class="hero__mask" aria-hidden="true"
              ><span class="hero__word" data-hero-word>{{ word }}</span></span
            >{{ ' ' }}
          </template>
        </h1>

        <p class="hero__lead" data-hero-fade>{{ site.hero.lead }}</p>

        <div class="hero__actions" data-hero-fade>
          <BaseCta to="/tienda" variant="gold" icon-right="fa-solid fa-arrow-right">
            {{ site.hero.ctaPrimary }}
          </BaseCta>
          <BaseCta to="/#historia" variant="light">{{ site.hero.ctaSecondary }}</BaseCta>
        </div>
      </div>

      <div class="hero__visual" :class="{ 'hero__visual--seal': !props.image }" data-hero-visual>
        <div ref="visual" class="hero__visual-inner" data-hero-visual-inner>
          <template v-if="props.image">
            <div class="hero__frame">
              <img
                class="hero__img"
                :src="cldUrl(props.image, 900)"
                :srcset="cldSrcset(props.image, [480, 720, 900, 1200])"
                sizes="(min-width: 1024px) 420px, 70vw"
                :alt="copy.home.heroImageAlt"
                width="800"
                height="1000"
                decoding="async"
                fetchpriority="high"
                data-hero-img
                @load="refreshScroll"
              />
            </div>
            <div class="hero__badge"><HeroSeal /></div>
          </template>
          <HeroSeal v-else />
        </div>
      </div>
    </div>

    <RouterLink to="/#historia" class="hero__scroll" data-hero-fade>
      <span>{{ copy.common.scroll }}</span>
      <span class="hero__scroll-line" aria-hidden="true"></span>
    </RouterLink>
  </section>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  @include flex(column, stretch, center);
  min-height: 100vh;
  min-height: 100svh;
  padding-block: 6.5rem 3.5rem;
  background: $roast;
  color: $paper;
  overflow: hidden;
  isolation: isolate;

  &__glow {
    position: absolute;
    inset: 0;
    z-index: -1;
    background:
      radial-gradient(60% 50% at 78% 38%, rgba($gold, 0.2), transparent 70%),
      radial-gradient(70% 60% at 10% 100%, rgba($accent, 0.55), transparent 70%);
  }

  &__inner {
    @include container;
    @include flex(column, stretch, center, 2.5rem);

    @include from('lg') {
      flex-direction: row;
      align-items: center;
      gap: 4rem;
    }
  }

  &__content {
    @include flex(column, flex-start, flex-start, 1.25rem);
    flex: 1 1 56%;
    min-width: 0;
  }

  &__eyebrow {
    @include eyebrow;
    @include flex(row, center, flex-start, 0.75rem);
    color: $gold;
  }

  &__eyebrow-line {
    width: 2.5rem;
    height: 1px;
    background: $gold;
  }

  &__title {
    @include display($display-lg, 500);
    font-size: clamp(2.7rem, 1.4rem + 6.2vw, 6rem);
    line-height: 1;
    max-width: 11ch;
  }

  // La máscara recorta la palabra mientras sube; el padding deja sitio a las
  // descendentes (la "y", la "p") para que no queden cortadas en reposo.
  &__mask {
    display: inline-block;
    overflow: hidden;
    vertical-align: top;
    padding-bottom: 0.14em;
    margin-bottom: -0.14em;
  }

  &__word {
    display: inline-block;
    will-change: transform;
  }

  &__lead {
    font-size: $text-lg;
    line-height: 1.6;
    color: rgba($paper, 0.78);
    max-width: 46ch;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.75rem);
    flex-wrap: wrap;
    margin-top: 0.5rem;
  }

  &__visual {
    flex: 0 1 auto;
    align-self: center;
    width: min(72vw, 300px);
    will-change: transform;

    @include from('lg') {
      width: min(34vw, 420px);
    }

    &--seal {
      width: min(78vw, 320px);

      @include from('lg') {
        width: min(36vw, 460px);
      }
    }
  }

  &__visual-inner {
    position: relative;
  }

  &__frame {
    aspect-ratio: 4 / 5;
    overflow: hidden;
    border-radius: 999px 999px $radius-md $radius-md;
    background: $roast-soft;
    outline: 1px solid rgba($gold, 0.55);
    outline-offset: 0.6rem;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    will-change: transform;
  }

  &__badge {
    position: absolute;
    right: -2.25rem;
    bottom: -2.25rem;
    width: 42%;
    padding: 0.4rem;
    border-radius: 50%;
    background: $roast;
  }

  &__scroll {
    display: none;

    @include from('lg') {
      @include flex(column, center, flex-start, 0.6rem);
      @include eyebrow;
      @include focus-ring($gold);
      position: absolute;
      bottom: 1.75rem;
      left: 50%;
      margin-left: -2rem;
      width: 4rem;
      color: rgba($paper, 0.7);
    }
  }

  &__scroll-line {
    width: 1px;
    height: 2.75rem;
    background: linear-gradient($gold, transparent);
    transform-origin: top;
    animation: hero-scroll 2.2s $ease infinite;
  }
}

@keyframes hero-scroll {
  0% {
    transform: scaleY(0);
  }
  55%,
  100% {
    transform: scaleY(1);
    opacity: 0;
  }
}
</style>
