<template>
  <section class="guide" id="start">
    <container>
      <h2>Quick Start Guide</h2>
      <div class="guide__content">
        <div class="guide__line">
          <div class="guide__point guide__point--1"></div>
          <div class="guide__point guide__point--2"></div>
          <div class="guide__point guide__point--3"></div>
          <div class="guide__point guide__point--4"></div>
          <div class="guide__point guide__point--5"></div>
        </div>
        <div class="guide__blocks">
          <div v-for="(item, index) in items" :key="index"
            :class="['guide__block', `guide__block--${item.name}`]">
            <picture>
              <source :srcset="`/assets/images/${item.url}.webp`" type="image/webp">
              <img :src="`/assets/images/${item.url}.png`"
                :alt="item.name">
            </picture>
            <div class="guide__text">
              <span class="guide__num">{{ item.num }}</span>
              <h3>{{ item.title }}</h3>
              <p>{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="guide__enjoy">Enjoy rendering!</div>
    </container>
  </section >
</template>

<script>
export default {
  name: 'Guide',
  data() {
    return {
      items: [
        {
          name: 'register',
          title: 'Register an account',
          desc: 'Create an account and get €8 to start rendering immediately.',
          url: 'guide_register',
          num: '01'
        },
        {
          name: 'order',
          title: 'Make an order',
          desc: 'Choose software, server type and render start time. Our support will receive order and issue an invoice',
          url: 'guide_order',
          num: '02'
        },
        {
          name: 'payment',
          title: 'Payment',
          desc: 'Pay invoice via Paypal, Visa, Mastercard. Our support will receive payment confirmation and give you login and password for TeamViewer.',
          url: 'guide_register',
          num: '03'
        },
        {
          name: 'remote',
          title: 'Remote control',
          desc: 'Use login and pass to access remote control of render node.',
          url: 'guide_remote',
          num: '04'
        },
      ]
    }
  }
}
</script>

<style lang="scss">
.guide {
  padding-top: 45px;
  padding-bottom: 80px;
  overflow: hidden;

  h2 {
    text-align: center;
  }

  @include bp(desktop--big) {
    padding-top: 87px;
    padding-bottom: 83px;

    h2 {
      margin-bottom: 80px;
    }
  }
}

.guide__content {
  position: relative;
  padding-bottom: 100px;
  margin-bottom: 34px;

  @include bp(desktop--big) {
    padding-bottom: 145px;
    margin-bottom: 50px;
  }
}

.guide__line {
  position: absolute;
  left: 50%;
  margin: auto;
  height: 100%;
  width: 1px;
  background: $violet-color;
}

.guide__point {
  position: absolute;
  left: -5.5px;
  border-radius: 50%;
  width: 11px;
  height: 11px;
  background: $violet-color;

  &--1 {
    top: 0;
  }

  &--2 {
    top: 420px;
  }

  &--3 {
    top: 775px;
  }

  &--4 {
    top: 1187px;
  }

  &--5 {
    top: 1508px;
  }

  @include bp(desktop) {
    &--2 {
      top: 480px;
    }

    &--3 {
      top: 958px;
    }

    &--4 {
      top: 1508px;
    }

    &--5 {
      top: 1908px;
    }
  }

  @include bp(desktop--big) {
    &--2 {
      top: 440px;
    }

    &--3 {
      top: 863px;
    }

    &--4 {
      top: 1319px;
    }

    &--5 {
      top: 1800px;
    }
  }
}

.guide__block {
  display: flex;
  justify-content: space-between;
}

.guide__block--register,
.guide__block--payment {
  img {
    max-width: 442px;
  }

  @include bp(desktop) {
    img {
      max-width: 623px;
    }
  }
}

.guide__block--register {
  @include bp(desktop--big) {
    img {
      margin-top: -40px;
    }
  }
}

.guide__block--order {
  img {
    max-width: 512px;
  }

  @include bp(tablet) {
    img {
      margin-right: -78px;
    }
  }

  @include bp(desktop) {
    img {
      max-width: 800px;
      margin-right: -140px;
      margin-top: -142px;
    }
  }

  @include bp(desktop--big) {
    img {
      margin-right: -160px;
    }
  }
}

.guide__block--remote {
  img {
    max-width: 520px;
    margin-top: 80px;
  }

  @include bp(tablet) {
    img {
      margin-right: -71px;
    }
  }

  @include bp(desktop) {
    img {
      max-width: 796px;
      margin-right: -121px;
      margin-top: 0;
    }
  }

  @include bp(desktop--big) {
    img {
      margin-right: -160px;
      margin-top: -120px;
    }
  }
}

.guide__text {
  margin-top: -4px;
  max-width: 47%;

  .guide__block--order &,
  .guide__block--remote & {
    text-align: right;
    order: -1;
  }

  .guide__block--order & {
    margin-top: 106px;
  }

  .guide__block--payment & {
    margin-top: 101px;
  }

  .guide__block--remote & {
    margin-top: 198px;
  }

  h3 {
    font-size: 30px;
    color: $violet-color;
    margin-top: 10px;
    margin-bottom: 13px;
  }

  p {
    font-size: 23px;
  }

  @include bp(desktop) {
    .guide__block--order & {
      margin-top: 42px;
    }

    .guide__block--remote & {
      margin-top: 218px;
    }
  }

  @include bp(desktop--big) {
    max-width: 49%;

    .guide__block--order & {
      margin-top: 41px;
    }

    .guide__block--payment & {
      margin-top: 46px;
    }

    .guide__block--remote & {
      margin-top: 68px;
    }

    h3 {
      font-size: 38px;
    }
  }
}

.guide__num {
  font-weight: bold;
}

.guide__enjoy {
  font-size: 38px;
  color: $violet-color;
  font-weight: bold;
  text-align: center;

  @include bp(desktop--big) {
    font-size: 50px;
  }
}
</style>
