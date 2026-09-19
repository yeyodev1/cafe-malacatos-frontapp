<script setup lang="ts">
import { HERO_BEANS as beans } from '@/composables/useHeroMotion'
import CoffeeBean from '@/components/ui/CoffeeBean.vue'

// Granos decorativos del hero. El contenedor externo de cada grano lo mueve el
// parallax (useHeroMotion); el interno lleva la rotación fija y el vaivén en CSS.
</script>

<template>
  <div class="beans" aria-hidden="true">
    <span
      v-for="(bean, index) in beans"
      :key="index"
      class="beans__item"
      :style="{
        top: bean.top,
        left: bean.left,
        width: bean.size,
        opacity: bean.speed < 0.2 ? 0.45 : 0.9,
      }"
      :data-speed="bean.speed"
      data-bean
    >
      <span class="beans__inner" :style="{ rotate: bean.rotate }" data-bean-inner>
        <CoffeeBean :tone="bean.tone" />
      </span>
    </span>
  </div>
</template>

<style scoped lang="scss">
.beans {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  // En 360 px los granos pasan detrás del texto: se atenúan para no estorbar.
  opacity: 0.45;

  @include from('lg') {
    opacity: 1;
  }

  &__item {
    position: absolute;
    will-change: transform;
  }

  &__inner {
    display: block;
    animation: beans-float 7s ease-in-out infinite alternate;
  }
}

@keyframes beans-float {
  to {
    transform: translateY(-10px);
  }
}
</style>
