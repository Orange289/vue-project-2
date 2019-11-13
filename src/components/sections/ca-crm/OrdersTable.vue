<template>
  <table-component
    class="orders-table"
    :show-caption="false"
    :show-filter="showFilter"
    :data="items"
    :sort-by="initialSortField"
    :sort-order="initialSortOrder">
    <table-column v-for="(item, index) in columns" :key="index"
      :show="item.name" :label="item.label"
      :data-type="item.type"
      :sortable="item.sort"
      :filterable="item.filter"
      :hidden="item.hidden"
      :header-class="item.name"
      :cell-class="item.name"
      :formatter="item.formatter ? item.formatter : void 0">
    </table-column>
  </table-component>

</template>

<script>
import TableComponent from 'vue-table-component';

TableComponent.settings({
    tableClass: 'orders-table__table',
    theadClass: 'orders-table__head',
    tbodyClass: 'orders-table__body',
    filterInputClass: 'orders-table__search',
    filterPlaceholder: 'Search...',
    filterNoResults: '',
});

export default {
  name: 'OrdersTable',
  props: {
    items: {
      type: Array
    },
    initialSortField: {
      type: String
    },
    initialSortOrder: {
      type: String
    },
    columns: {
      type: Array
    },
    showFilter: {
      type: Boolean,
      default: false
    },
  },
  computed: {
  },
}
</script>
<style lang="scss">
.orders-table {
  th {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.42px;
    color: rgba($gray-dark-color, .3);
    position: relative;
    padding-bottom: 16px;
    cursor: default;
  }

  [class*="table-component__th--sort"] {
      cursor: pointer;
    }

  [class*="table-component__th--sort"]:after {
    content: '';
    display: inline-block;
    width: 6px;
    height: 10px;
    background: url('/assets/images/sort-icon.png');
    background-repeat: no-repeat;
    background-size: contain;
    vertical-align: middle;
    margin-top: 2px;
  }

  .table-component__filter__clear {
    display: none;
  }

  .table-component__filter {
    position: relative;
    margin-bottom: 40px;

    &:before {
      content: '';
      position: absolute;
      left: 26px;
      top: 15px;
      width: 20px;
      height: 20px;
      background: url('/assets/icons/search.svg');
    }
  }

  .status {
    position: relative;
  }

  .P {
    @include set-table-status($pink-color, '/assets/icons/waiting.svg');
  }

  .I {
    @include set-table-status($green-color, '/assets/icons/progress.svg');
    position: relative;
  }

  .W {
    @include set-table-status($violet-light-color, '/assets/icons/progress.svg');
  }

  .R {
    @include set-table-status($yellow-color, '/assets/icons/waiting.svg');
  }
}

.orders-table__table {
  border-spacing: 0 10px;

  tbody tr {
    margin-bottom: 10px;
    background-color: #fff;
  }

  td {
    font-size: 15px;
    font-weight: 600;
    padding-top: 17px;
    padding-bottom: 16px;

    &:first-child {
      padding-left: 25px;
      padding-right: 10px;
    }

    &.left {
      font-size: 23px;
      font-weight: 600;
      letter-spacing: 0.69px;
    }

    &.status {
      padding-left: 23px;
      padding-right: 23px;
      position: relative;
      letter-spacing: 0.42px;
    }

    &.gpuStatus {
      padding-left: 10px;
    }

    &.status:before {
      content: '';
      position: absolute;
      left: 0;
      top: 29px;
      width: 8px;
      height: 8px;
      border-radius: 100%;
      background-color: inherit;
    }
  }

  .number {
    font-size: 14px;
  }

  .node,
  .start,
  .left,
  .status {
    text-align: left;
  }

  .start {
    letter-spacing: 0.45px;
  }

  .duration,
  .price {
    text-align: center;
  }

}

.orders-table__search {
  font-size: 14px;
  font-weight: 600;
  color: rgba($gray-dark-color, .3);
  width: 100%;
  border: none;
  border-bottom: 1px solid rgba($gray-dark-color, .3);
  background: transparent;
  padding: 16px 60px;

  &:focus {
    outline: none;
  }
}

.orders-table__table {
  width: 100%;
}

.table-component__message {
  display: none;
}
</style>
