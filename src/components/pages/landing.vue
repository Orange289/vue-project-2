<template>
  <main class="landing">
    <mainHeader />
    <Intro />
    <Software />
    <Pricing />
    <Guide />
    <Documents />
    <Footer />
  </main>
</template>

<script>
import mainHeader from './../sections/landing/Header.vue';
import Intro from './../sections/landing/Intro.vue';
import Software from './../sections/landing/Software.vue';
import Pricing from './../sections/landing/Pricing.vue';
import Guide from './../sections/landing/Guide.vue';
import Documents from './../sections/landing/Documents.vue';

export default {
  components: {
    mainHeader,
    Intro,
    Software,
    Pricing,
    Documents,
    Guide
  },
}
</script>

<style style="scss">
</style>
