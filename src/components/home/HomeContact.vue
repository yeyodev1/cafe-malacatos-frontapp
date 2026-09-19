<script setup lang="ts">
import { computed, ref } from 'vue'
import { site } from '@/config/site'
import { copy } from '@/config/copy'
import { useSettingsStore } from '@/stores/settings'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useWhatsappOrder } from '@/composables/useWhatsappOrder'
import { toInternationalPhone } from '@/utils/schema'
import BaseCta from '@/components/ui/BaseCta.vue'

const root = ref<HTMLElement | null>(null)
const settings = useSettingsStore()
const { smartLink } = useWhatsappOrder()
const text = copy.home.contact

const places = [
  { icon: 'fa-solid fa-industry', ...site.locations.factory },
  { icon: 'fa-solid fa-store', ...site.locations.branches },
]
const phoneHref = computed(() => `tel:${toInternationalPhone(settings.contactPhone)}`)

useScrollReveal(root)
</script>

<template>
  <section id="contacto" ref="root" class="contact" aria-labelledby="contact-title">
    <div class="contact__inner">
      <header class="contact__head">
        <p class="contact__eyebrow" data-reveal>{{ text.eyebrow }}</p>
        <h2 id="contact-title" class="contact__title" data-reveal>{{ text.title }}</h2>
        <p class="contact__lead" data-reveal>{{ text.lead }}</p>
        <BaseCta :href="smartLink" variant="dark" icon="fa-brands fa-whatsapp" data-reveal>
          {{ text.cta }}
        </BaseCta>
      </header>

      <div class="contact__cards" data-reveal-group>
        <address v-for="place in places" :key="place.title" class="contact__card" data-reveal-item>
          <span class="contact__icon"><i :class="place.icon" aria-hidden="true"></i></span>
          <h3 class="contact__card-title">{{ place.title }}</h3>
          <ul class="contact__lines">
            <li v-for="line in place.lines" :key="line">{{ line }}</li>
          </ul>
        </address>

        <address class="contact__card" data-reveal-item>
          <span class="contact__icon"><i class="fa-solid fa-phone" aria-hidden="true"></i></span>
          <h3 class="contact__card-title">{{ text.eyebrow }}</h3>
          <ul class="contact__lines">
            <li>
              <span class="contact__label">{{ text.phoneLabel }}</span>
              <a class="contact__link" :href="phoneHref">{{ settings.contactPhone }}</a>
            </li>
            <li>
              <span class="contact__label">{{ text.emailLabel }}</span>
              <a class="contact__link" :href="`mailto:${settings.contactEmail}`">
                {{ settings.contactEmail }}
              </a>
            </li>
            <li v-if="settings.socialLinks.length">
              <span class="contact__label">{{ text.socialLabel }}</span>
              <span class="contact__social">
                <a
                  v-for="item in settings.socialLinks"
                  :key="item.key"
                  class="contact__social-link"
                  :href="item.url"
                  target="_blank"
                  rel="noopener"
                  :aria-label="item.label"
                >
                  <i :class="item.icon" aria-hidden="true"></i>
                </a>
              </span>
            </li>
          </ul>
        </address>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.contact {
  background: $paper;
  padding-block: $space-section;
  scroll-margin-top: 4rem;

  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, $space-lg);
  }

  &__head {
    @include flex(column, flex-start, flex-start, 1rem);
    max-width: 720px;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-md);
  }

  &__lead {
    font-size: $text-lg;
    color: $ink-soft;
    margin-bottom: 0.5rem;
  }

  &__cards {
    @include flex-cards(260px, 1.25rem);
  }

  &__card {
    @include card;
    @include flex(column, flex-start, flex-start, 0.75rem);
    padding: 1.75rem 1.5rem;
    border-radius: $radius-md;
    font-style: normal;
  }

  &__icon {
    @include flex(row, center, center);
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    background: $gold-soft;
    color: $accent-deep;
  }

  &__card-title {
    @include display($text-xl, 500);
  }

  &__lines {
    @include flex(column, stretch, flex-start, 0.6rem);
    list-style: none;
    width: 100%;
    color: $ink-soft;
    font-size: $text-sm;
  }

  &__label {
    @include eyebrow;
    display: block;
    font-size: 0.65rem;
    color: $ink-soft;
  }

  &__link {
    @include focus-ring;
    color: $ink;
    font-weight: 500;
    overflow-wrap: anywhere;
    border-bottom: 1px solid $line;

    &:hover {
      color: $accent;
      border-color: $accent;
    }
  }

  &__social {
    @include flex(row, center, flex-start, 0.5rem);
    margin-top: 0.3rem;
  }

  &__social-link {
    @include flex(row, center, center);
    @include transition;
    @include focus-ring;
    width: 2.75rem;
    height: 2.75rem;
    border: 1px solid $line;
    border-radius: 50%;
    color: $ink;

    &:hover {
      background: $ink;
      border-color: $ink;
      color: $paper;
    }
  }
}
</style>
