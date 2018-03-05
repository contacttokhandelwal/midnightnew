/*browser:true*/
/*global define*/
define(
    [
        'uiComponent',
        'Magento_Checkout/js/model/payment/renderer-list'
    ],
    function (
        Component,
        rendererList
    ) {
        'use strict';
        rendererList.push(
            {
                type: 'pumcp',
                component: 'PayUMCitrus_Pumcp/js/view/payment/method-renderer/pumcp-method'
            }
        );
        /** Add view logic here if needed */
        return Component.extend({});
    }
);
