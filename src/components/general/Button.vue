<template>
  <a v-if="href" :href="href" class="sixnines-btn"><slot></slot></a>
  <button v-else :type="type" @click="btnAction" class="sixnines-btn"><slot></slot></button>
</template>

<script>
export default {
  name: 'btn',
  props: {
    href: String,
    type: String,
    btnAction: {
      type: Function}
    },
  computed: {
    resultType () {
      if (!this.type || this.type.toLowerCase() !== "submit") {
        return "button";
      } else if(this.type.toLowerCase() === "submit") {
        return "submit";
      }
    }
  }
}
</script>

<style lang="scss">
.sixnines-btn {
  @include btn();
}

a.sixnines-btn {
  &:hover {
    text-decoration: none;
  }
}
</style>
