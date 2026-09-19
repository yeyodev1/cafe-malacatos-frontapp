<script setup lang="ts">
import { computed } from 'vue'
import { adminCopy } from '@/config/copy.admin'
import { whatsappLink } from '@/config/site'
import { toWhatsappNumber } from '@/composables/admin/adminFormat'
import AdminSection from './AdminSection.vue'
import type { Order } from '@/types'

const text = adminCopy.order
const props = defineProps<{ order: Order }>()

// El mensaje ya lleva el número de la orden: el cliente sabe de qué le hablan.
const whatsappHref = computed(() => {
  const number = toWhatsappNumber(props.order.customer.phone)
  if (!number) return ''
  const firstName = props.order.customer.name.trim().split(' ')[0] || ''
  return whatsappLink(text.whatsappMessage(firstName, props.order.number), number)
})

const mapHref = computed(() => {
  const { lat, lng } = props.order.shipping
  if (typeof lat !== 'number' || typeof lng !== 'number') return ''
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
})
</script>

<template>
  <AdminSection :title="text.contactTitle" icon="fa-solid fa-user">
    <div class="contact">
      <p class="contact__name">{{ order.customer.name }}</p>
      <a :href="`mailto:${order.customer.email}`" class="contact__link">
        <i class="fa-solid fa-envelope" aria-hidden="true"></i>{{ order.customer.email }}
      </a>
      <a v-if="order.customer.phone" :href="`tel:${order.customer.phone}`" class="contact__link">
        <i class="fa-solid fa-phone" aria-hidden="true"></i>{{ order.customer.phone }}
      </a>
      <a
        v-if="whatsappHref"
        :href="whatsappHref"
        target="_blank"
        rel="noopener"
        class="contact__wa"
      >
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>{{ text.whatsappCta }}
      </a>
    </div>

    <div class="contact contact--divider">
      <h3 class="contact__subtitle">
        <i class="fa-solid fa-location-dot" aria-hidden="true"></i>{{ text.shippingTitle }}
      </h3>
      <p class="contact__address">
        {{ order.shipping.address }}<br />
        {{ order.shipping.city }}, {{ order.shipping.province }}
      </p>
      <p v-if="order.shipping.reference" class="contact__reference">
        <strong>{{ text.reference }}:</strong> {{ order.shipping.reference }}
      </p>
      <a v-if="mapHref" :href="mapHref" target="_blank" rel="noopener" class="contact__link">
        <i class="fa-solid fa-map-location-dot" aria-hidden="true"></i>{{ text.mapCta }}
      </a>
    </div>

    <div v-if="order.trackingNote" class="contact contact--divider">
      <h3 class="contact__subtitle">
        <i class="fa-solid fa-truck-fast" aria-hidden="true"></i>{{ text.trackingTitle }}
      </h3>
      <p class="contact__address">{{ order.trackingNote }}</p>
    </div>
  </AdminSection>
</template>

<style scoped lang="scss">
.contact {
  @include flex(column, flex-start, flex-start, 0.35rem);

  &--divider {
    padding-top: 1.1rem;
    border-top: 1px solid $line;
  }

  &__name {
    font-size: $text-lg;
    font-weight: 600;
  }

  &__subtitle {
    @include flex(row, center, flex-start, 0.5rem);
    font-family: $font-principal;
    font-size: $text-sm;
    font-weight: 700;

    i {
      color: $accent;
    }
  }

  &__link {
    @include flex(row, center, flex-start, 0.55rem);
    @include focus-ring;
    min-height: 2.75rem;
    color: $accent-deep;
    font-size: $text-sm;
    font-weight: 600;
    overflow-wrap: anywhere;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  &__address,
  &__reference {
    font-size: $text-sm;
    color: $ink-soft;
    overflow-wrap: anywhere;
    white-space: pre-line;
  }

  &__wa {
    @include flex(row, center, center, 0.55rem);
    @include transition(background-color);
    @include focus-ring($whatsapp);
    align-self: stretch;
    min-height: 3rem;
    margin-top: 0.4rem;
    padding: 0.6rem 1.2rem;
    border-radius: $radius-pill;
    background: $whatsapp;
    color: $surface;
    font-size: $text-sm;
    font-weight: 700;

    i {
      font-size: 1.2rem;
    }

    &:hover {
      background: $whatsapp-deep;
    }

    @include from('sm') {
      align-self: flex-start;
    }
  }
}
</style>
