<?php
/**
 * Mageplaza
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Mageplaza.com license that is
 * available through the world-wide-web at this URL:
 * https://www.mageplaza.com/LICENSE.txt
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade this extension to newer
 * version in the future.
 *
 * @category    Mageplaza
 * @package     Mageplaza_Osc
 * @copyright   Copyright (c) 2017 Mageplaza (http://www.mageplaza.com/)
 * @license     https://www.mageplaza.com/LICENSE.txt
 */

namespace Mageplaza\Osc\Model\Plugin\Quote;

use Magento\Authorization\Model\UserContextInterface;
use Magento\Framework\Exception\StateException;
use Magento\Quote\Api\CartRepositoryInterface;
use Magento\Quote\Api\Data\CartInterface;
use Magento\Quote\Model\Quote;

/**
 * Class AccessChangeQuoteControl
 * @package Mageplaza\Osc\Model\Plugin\Quote
 */
class AccessChangeQuoteControl
{
    /**
     * @var \Mageplaza\Osc\Helper\Data
     */
    protected $_oscHelperData;

    /**
     * @var UserContextInterface
     */
    protected $userContext;

    /**
     * AccessChangeQuoteControl constructor.
     * @param \Mageplaza\Osc\Helper\Data $oscHelperData
     */
    public function __construct(\Mageplaza\Osc\Helper\Data $oscHelperData, UserContextInterface $userContext)
    {
        $this->_oscHelperData = $oscHelperData;
        $this->userContext    = $userContext;
    }

    /**
     * Checks if change quote's customer id is allowed for current user.
     *
     * @param CartRepositoryInterface $subject
     * @param Quote $quote
     * @throws StateException if Guest has customer_id or Customer's customer_id not much with user_id
     * or unknown user's type
     * @return void
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function beforeSave(CartRepositoryInterface $subject, CartInterface $quote)
    {
        if (!$this->isAllowed($quote)) {
            throw new StateException(__("Invalid state change requested"));
        }
    }

    /**
     * Checks if user is allowed to change the quote.
     *
     * @param Quote $quote
     * @return bool
     */
    private function isAllowed(Quote $quote)
    {
        switch ($this->userContext->getUserType()) {
            case UserContextInterface::USER_TYPE_CUSTOMER:
                $isAllowed = ($quote->getCustomerId() == $this->userContext->getUserId());
                break;
            case UserContextInterface::USER_TYPE_GUEST:
                $isAllowed = ($this->_oscHelperData->isFlagOscMethodRegister()
                    || $quote->getCustomerId() === null);
                break;
            case UserContextInterface::USER_TYPE_ADMIN:
            case UserContextInterface::USER_TYPE_INTEGRATION:
                $isAllowed = true;
                break;
            default:
                $isAllowed = false;
        }

        return $isAllowed;
    }
}