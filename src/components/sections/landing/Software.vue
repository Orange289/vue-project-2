<template>
  <section class="software" id="software">
    <container class="software__content">
      <h2>Software & hardware</h2>
      <p class="software__desc">
        Six Nines provides only&nbsp;<b>GPU rendering.</b>
      </p>
      <div class="software__redactors">
        <b>3d Editors</b>
        <ul>
          <li v-for="(item, index) in items"
            :key="index">
            <div :class="`software__redactors-icon software__redactors-icon--${item.name}`">
              <img :alt="item.name" :src="`/assets/images/${item.name}-icon.png`" >
            </div>
            {{ item.title }}
          </li>
        </ul>
      </div>
      <div class="software__render">
        <svg>
          <use xlink:href="#sprite-render"></use>
        </svg>
        <p>We have <b>4x GPU nodes</b> for&nbsp;you.</p>
      </div>
    </container>
    <div class="software__images">
      <picture>
        <source srcset="/assets/images/redshift@2x.webp 2x" type="image/webp">
        <img src="/assets/images/redshift.jpg"
          srcset="/assets/images/redshift@2x.jpg 2x"
          alt="redshift-pic">
      </picture>
      <picture>
        <source srcset="/assets/images/octane@2x.webp 2x" type="image/webp">
        <img src="/assets/images/octane.jpg"
          srcset="/assets/images/octane@2x.jpg 2x"
          alt="octane-pic">
      </picture>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Software',
  data() {
    return {
      items: [
        {
          name: 'cinema',
          title: 'Cinema 4D'
        },
        {
          name: 'max',
          title: '3Ds Max'
        },
        {
          name: 'maya',
          title: 'Maya'
        },
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.software {
  display: flex;
  justify-content: space-between;
  overflow: hidden;
}

.software__content {
  padding-top: 60px;
  padding-bottom: 74px;
  padding-right: 50px;

  @include bp(desktop--big) {
    padding-top: 85px;
    padding-bottom: 185px;

    h2 {
      margin-bottom: 96px;
    }
  }
}

.software__desc {
  // font-size: 20px;
  // margin-bottom: 30px;

  b {
    color: $violet-color;
    font-weight: bold;
  }

  // @include bp(tablet) {
    font-size: 30px;
    margin-bottom: 56px;
  // }

  @include bp(desktop--big) {
    font-size: 38px;
    max-width: 407px;
    display: inline-block;
    vertical-align: top;
    margin-right: 72px;
  }
}

.software__redactors {
  margin-bottom: 45px;

  b {
    font-size: 20px;
    color: $violet-color;
    font-weight: bold;
    margin-bottom: 27px;
    display: block;
  }

  li {
    font-size: 20px;
    font-weight: bold;
    display: flex;
    align-items: center;
    margin-bottom: 21px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  // @include bp(tablet) {
    margin-bottom: 72px;

    b {
      font-size: 30px;
      margin-bottom: 48px;
    }

    ul {
      display: flex;
      flex-wrap: wrap;
    }

    li {
      font-size: 30px;
      width: 50%;
    }
  // }

  @include bp(desktop--big) {
    max-width: 329px;
    display: inline-block;
    vertical-align: top;

    b {
      font-size: 38px;
      margin-bottom: 44px;
    }

    li {
      font-size: 38px;
      width: 100%;
      margin-bottom: 58px;
    }
  }
}

.software__redactors-icon {
  width: 50px;
  margin-right: 20px;
  text-align: center;

  img {
    max-width: 50px;
  }

  &--max img {
    width: 35px;
  }

  // @include bp(tablet) {
    width: 60px;

    img {
      max-width: 60px;
    }

    &--max img {
      width: 45px;
    }
  // }

  @include bp(desktop--big) {
    margin-right: 47px;
    width: 72px;
    height: 74px;

    img {
      max-width: 72px;
    }

    &--max img {
      width: 54px;
    }
  }
}

.software__images {
  font-size: 0;
  // display: none;

  // @include bp(tablet) {
    display: block;
    text-align: right;
    width: 341px;

    img {
      max-height: 350px;
    }
  // }

  @include bp(desktop) {
    position: absolute;
    right: 0;
    overflow: hidden;
  }

  @include bp(desktop--big) {
    width: 690px;

    img {
      max-height: 400px;
    }
  }
}

.software__render {
  font-size: 23px;
  padding-top: 43px;
  display: flex;
  align-items: center;
  border-top: 1px solid $gray-light-color;

  b {
    color: $violet-color;
  }

  svg {
    width: 60px;
    height: 73px;
    margin-right: 20px;
  }

  @include bp(desktop) {
    padding-top: 46px;
  }

  @include bp(desktop--big) {
    max-width: 407px;
    margin-top: -200px;
    padding-top: 50px;

    svg {
      width: 95px;
      height: 115px;
      margin-right: 24px;
    }
  }
}
</style>
