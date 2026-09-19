<script setup lang="ts">
import { site } from '@/config/site'
import { copy } from '@/config/copy'
import { useSettingsStore } from '@/stores/settings'
import { useSiteNav } from '@/composables/useSiteNav'
import { useWhatsappOrder } from '@/composables/useWhatsappOrder'
import { toInternationalPhone } from '@/utils/schema'

const settings = useSettingsStore()
const { onNavigate } = useSiteNav()
const { contactLink } = useWhatsappOrder()

const year = new Date().getFullYear()
const categories = Object.entries(site.categories)
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <p class="footer__name">{{ site.name }}</p>
        <p class="footer__tagline">{{ site.tagline }}</p>
        <p class="footer__about">{{ site.description }}</p>
        <ul v-if="settings.socialLinks.length" class="footer__social">
          <li v-for="item in settings.socialLinks" :key="item.key">
            <a
              class="footer__social-link"
              :href="item.url"
              target="_blank"
              rel="noopener"
              :aria-label="item.label"
            >
              <i :class="item.icon" aria-hidden="true"></i>
            </a>
          </li>
        </ul>
      </div>

      <nav class="footer__col" :aria-label="copy.footer.navTitle">
        <h2 class="footer__heading">{{ copy.footer.navTitle }}</h2>
        <RouterLink
          v-for="link in site.nav"
          :key="link.to"
          :to="link.to"
          class="footer__link"
          @click="onNavigate(link.to)"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <nav class="footer__col" :aria-label="copy.footer.shopTitle">
        <h2 class="footer__heading">{{ copy.footer.shopTitle }}</h2>
        <RouterLink to="/tienda" class="footer__link">{{ copy.footer.allProducts }}</RouterLink>
        <RouterLink
          v-for="[key, label] in categories"
          :key="key"
          :to="{ path: '/tienda', query: { categoria: key } }"
          class="footer__link"
        >
          {{ label }}
        </RouterLink>
      </nav>

      <address class="footer__col">
        <h2 class="footer__heading">{{ copy.footer.contactTitle }}</h2>
        <a class="footer__link" :href="`tel:${toInternationalPhone(settings.contactPhone)}`">
          <i class="fa-solid fa-phone" aria-hidden="true"></i> {{ settings.contactPhone }}
        </a>
        <a class="footer__link" :href="`mailto:${settings.contactEmail}`">
          <i class="fa-solid fa-envelope" aria-hidden="true"></i> {{ settings.contactEmail }}
        </a>
        <a class="footer__link" :href="contactLink" target="_blank" rel="noopener">
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> WhatsApp
        </a>
        <p class="footer__place">
          <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
          {{ site.locations.factory.lines.join(', ') }}
        </p>
      </address>
    </div>

    <div class="footer__bar">
      <span>© {{ year }} {{ site.name }}</span>
      <span>
        {{ copy.footer.madeBy }}
        <a class="footer__credit" href="https://bakano.ec" target="_blank" rel="noopener">Bakano</a>
      </span>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  margin-top: auto;
  background: $roast;
  color: rgba($paper, 0.8);
  border-top: 3px solid $gold-deep;

  &__inner {
    @include container;
    @include flex-cards(180px, 2.5rem);
    padding-block: $space-xl 2.5rem;
  }

  &__brand {
    flex: 2 1 280px;
  }

  &__name {
    @include display($display-sm, 500);
    color: $paper;
  }

  &__tagline {
    @include eyebrow;
    margin-block: 0.6rem 1rem;
    color: $gold;
  }

  &__about {
    max-width: 40ch;
    font-size: $text-sm;
    color: rgba($paper, 0.7);
  }

  &__social {
    @include flex(row, center, flex-start, 0.5rem);
    list-style: none;
    margin-top: 1.25rem;
  }

  &__social-link {
    @include flex(row, center, center);
    @include transition;
    @include focus-ring($gold);
    width: 2.75rem;
    height: 2.75rem;
    border: 1px solid rgba($paper, 0.25);
    border-radius: 50%;
    color: $paper;

    &:hover {
      border-color: $gold;
      color: $gold;
    }
  }

  &__col {
    @include flex(column, flex-start, flex-start, 0.2rem);
    font-size: $text-sm;
    font-style: normal;
  }

  &__heading {
    @include eyebrow;
    margin-bottom: 0.6rem;
    color: $gold;
  }

  &__link {
    @include flex(row, center, flex-start, 0.6rem);
    @include transition(color);
    @include focus-ring($gold);
    min-height: 2.25rem;
    color: rgba($paper, 0.8);
    overflow-wrap: anywhere;

    &:hover {
      color: $gold;
    }
  }

  &__place {
    @include flex(row, flex-start, flex-start, 0.6rem);
    margin-top: 0.4rem;
    color: rgba($paper, 0.7);

    i {
      margin-top: 0.35rem;
    }
  }

  &__bar {
    @include container;
    @include flex(row, center, space-between, 1rem);
    flex-wrap: wrap;
    // Deja libre la esquina del botón flotante de WhatsApp.
    padding-block: 1.25rem 5rem;
    border-top: 1px solid rgba($paper, 0.12);
    font-size: $text-xs;
    color: rgba($paper, 0.65);

    @include from('md') {
      padding-block: 1.25rem;
      padding-right: 6rem;
    }
  }

  &__credit {
    @include focus-ring($gold);
    color: $paper;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}
</style>
