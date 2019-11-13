<template>
  <footer class="footer">
    <container>
      <div class="footer__top">
        <logo />
        <ul class="footer__links">
          <li v-for="(item, index) in items" :key="index">
            <a :href="item.url" :class="[{'sixnines-btn' : item.isBtn}]">{{ item.name }}</a>
          </li>
        </ul>
      </div>
      <div class="footer__bottom">
        <div class="footer__text">
          <p>Six nines AB, reg number 559140-9254, c/o Hellström Advokatbyrå, Box 7305, 103 90 STOCKHOLM</p>
          <p>CMNO Ltd Reg. Number HE 376006 Ioannis Stylianou, 6, Floor 2, Flat 202 2003, Nicosia, Cyprus</p>
        </div>
        <a class="footer__social" href="#">
          <svg>
            <use xlink:href="#sprite-social-facebook"></use>
          </svg>
          FACEBOOK
        </a>
      </div>
    </container>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      items: [
        {
          name: 'About us',
          url: '#'
        },
        {
          name: 'Services',
          url: '#'
        },
        {
          name: 'Technology',
          url: '#'
        },
        {
          name: 'Partners',
          url: '#'
        },
        {
          name: 'Contacts',
          url: '#'
        },
        {
          name: 'Make a request',
          url: '#',
          isBtn: true
        },
      ]
    }
  }
}
</script>

<style lang="scss">
.footer {
  background: $gray-dark-color;
  padding-top: 60px;
  padding-bottom: 62px;
  position: relative;
  z-index: 1;

  .sixnines-btn {
    @include btn($blue-color, $blue-color, #fff, 188px, 28px);
    margin-top: 0;
    margin-bottom: 0;
    margin-left: 39px;
  }

  @include bp(desktop) {
    padding-top: 97px;
    padding-bottom: 110px;

    .sixnines-btn {
      margin-left: 93px;
    }
  }
}

.footer__top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 50px;
}

.footer__links {
  display: flex;
  align-items: center;

  a {
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    text-transform: uppercase;
  }

  li + li a {
    margin-left: 39px;
  }

  @include bp(desktop) {
    li + li a {
      margin-left: 93px;
    }
  }
}

.footer__bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.footer__text {
  p {
    font-size: 14px;
    color: rgba(#fff, .2);
  }

  p + p {
    margin-top: 17px;
  }
}

.footer__social {
  display: flex;

  svg {
    width: 20px;
    height: 20px;
    margin-right: 14px;
  }
}
</style>
