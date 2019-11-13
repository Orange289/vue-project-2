<template>
  <div
    class="burger"
    @click="openMenu()">
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<script>
export default {
  name: 'Burger',
  props: {
    menuArea: {
      default: 'header',
      type: String
    }
  },

  methods: {
    openMenu() {
      let _self = this;
      document.body.classList.add('openedMenu');

      setTimeout(function() {
        switch (_self.menuArea) {
          case 'header':
            document.querySelector('.header__menu').classList.remove('hidden');
            break;
          case 'intro':
            document.querySelector('.intro__menu').classList.remove('hidden');
            break;
        }
      }, 1);
    },
  }
}
</script>

<style lang="scss" scoped>
.burger {
  cursor: pointer;
  width: 25px;
  height: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  div {
    width: 25px;
    height: 2px;
    background: #fff;
  }

  div:nth-child(1) {
    width: 20px;
    margin-left: 5px;
  }

  div:nth-child(2) {
    margin: 6px 0 6px 0;
  }

  div:nth-child(3) {
    width: 20px;
    margin-right: 5px;
  }
}
</style>
