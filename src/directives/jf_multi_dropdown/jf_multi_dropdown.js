class jfMultiDropdownController {
    constructor($scope) {

        this.$scope = $scope;

        this.opened = false;

        this.handleOutsideClick();

        this.sortItems();

    }

    handleOutsideClick() {
        let handler = (e) => {
            let outside = !$(e.target).parents('.jf-multi-dropdown').length
            if (outside) {
                this.opened = false;
                this.sortItems();
            }
            this.$scope.$apply();
        };
        $(document).on('click',handler);
        this.$scope.$on('$destroy',() => {
            $(document).off('click', handler)
        })
    }

    onClick() {
        if (!this.items) return;
        this.opened = !this.opened;
        if (!this.opened) this.sortItems();
        this.filterText = '';
    }
    onSelection() {
        if (this.onChange) this.onChange();
    }

    sortItems() {
        if (!this.items) return;
        let selected = _.sortBy(_.filter(this.items, (item) => item.isSelected), 'text');
        let unSelected = _.sortBy(_.filter(this.items, (item) => !item.isSelected), 'text');
        this.lastSelectedIndex = selected.length-1;
        let combined = selected.concat(unSelected);
        this.items.splice.apply(this.items, [0,this.items.length].concat(combined));
    }

}

export function jfMultiDropdown() {
    return {
        controller: jfMultiDropdownController,
        controllerAs: 'jfMultiDropdown',
        bindToController: true,
        scope: {
            title: '@',
            filterPlaceholder: '@',
            items: '=',
            onChange: '&?'
        },
        templateUrl: 'directives/jf_multi_dropdown/jf_multi_dropdown.html'
    }
}