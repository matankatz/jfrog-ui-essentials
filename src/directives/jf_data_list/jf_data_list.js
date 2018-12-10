class jfDataListController {
    constructor($scope, $rootScope, $element, $timeout, JFrogModal, JFrogUIUtils) {
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.$element = $element;
        this.$timeout = $timeout;
        this.JFrogModal = JFrogModal;
        this.JFrogUIUtils = JFrogUIUtils;

        this.$scope.$watch('jfDataList.items', items => {
            if (items) {
                this.formattedItems = _.filter(items, (item) => {
                    return item.label != '';
                });
            }
        })
    }

    /**
     * htmlIsOverflowing(rowId)
     * Get al the row's children.
     * Then sum all the children's box model width (includes padding and margin) in a loop
     * If the child already has the overflowing class => remove it
     * When the sum gets > then the container's width => add the overflowing class to him
     * After exiting the loop return the overflowing flag
     * **/
    htmlIsOverflowing(rowId) {
        let elem = this.$element.find(rowId);
        if (elem.length) {
            let children = elem.children('.tag');
            let maxWidth = elem.closest('.data-list-item-value').outerWidth() - 60;
            let totalChildrenWidth = 0;
            children.each((i, child) => {
                let childElem = $(child);
                totalChildrenWidth += childElem.outerWidth()
                    + parseInt(childElem.css('margin-left'))
                    + parseInt(childElem.css('margin-right'));

                if (totalChildrenWidth < maxWidth) {
                    childElem.removeClass('overflowing-child');
                }
                if (totalChildrenWidth > maxWidth && !childElem.is('.overflowing-child')) {
                    childElem.addClass('overflowing-child');
                }

            });
            return elem.children('.tag.overflowing-child').length > 0;
        }
        else{
            return false;
        }
    }

    showAll(model, rowName, objectName) {
        //objectName = _.startCase(objectName.indexOf('/') >= 0 ? objectName.split('/')[0] : this.objectName);

        let modalScope = this.$rootScope.$new();
        modalScope.items = model;
        modalScope.rowName = rowName;
        modalScope.objectName = objectName;

        modalScope.filter = {};
        modalScope.filterItem = (item) => {
            if (modalScope.filter.text) {
                let escaped = this.JFrogUIUtils.escapeForRegex(modalScope.filter.text);
                let regex = new RegExp('.*' + escaped.split('\\*').join('.*') + '.*', 'i');
                return regex.test(item.label);
            }
            else {
                return true;
            }
        };

        modalScope.noResults = () => {
            let filteredResults = _.filter(modalScope.items, (item) => {
                return modalScope.filterItem(item);
            });
            return filteredResults.length === 0;
        };

        this.JFrogModal.launchModalWithTemplateMarkup(require('./jf_data_list.show_all_modal.html'), modalScope, 'sm', true);
    }

    isArray(o) {
        return Array.isArray(o);
    }

    getItemValue(value) {
        return value || '&nbsp';
    }
}


export function jfDataList() {
    return {
        restrict: 'E',
        scope: {
            items: '='
        },
        controller: jfDataListController,
        controllerAs: 'jfDataList',
        bindToController: true,
        templateUrl: 'directives/jf_data_list/jf_data_list.html'
    }
}