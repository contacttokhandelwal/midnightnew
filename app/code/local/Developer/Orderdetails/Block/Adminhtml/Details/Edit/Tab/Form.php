<?php

class Developer_Orderdetails_Block_Adminhtml_Details_Edit_Tab_Form extends Mage_Adminhtml_Block_Widget_Form {

    protected function _prepareForm() {

        $form = new Varien_Data_Form();
        $this->setForm($form);
        $fieldset = $form->addFieldset("orderdetails_form", array("legend" => Mage::helper("orderdetails")->__("Item information")));


        $fieldset->addField("order_id", "text", array(
            "label" => Mage::helper("orderdetails")->__(" Order id"),
            "name" => "order_id",
            'readonly' => true
        ));

        $fieldset->addField("increment_id", "text", array(
            "label" => Mage::helper("orderdetails")->__("Increment Id"),
            "name" => "increment_id",
            'readonly' => true
        ));

        $fieldset->addField("customer_id", "text", array(
            "label" => Mage::helper("orderdetails")->__("Customer Id"),
            "name" => "customer_id",
            'readonly' => true
        ));

        $fieldset->addField("customer_email", "text", array(
            "label" => Mage::helper("orderdetails")->__("Customer Email"),
            "name" => "customer_email",
            'readonly' => true
        ));
        $fieldset->addField("order_date", "text", array(
            "label" => Mage::helper("orderdetails")->__("Order Date"),
            "name" => "order_date",
            'readonly' => true
        ));
        $fieldset->addField("delivery_date", "text", array(
            "label" => Mage::helper("orderdetails")->__("Delivery Date"),
            "name" => "delivery_date",
            'readonly' => true
        ));
        $fieldset->addField("delivery_time", "text", array(
            "label" => Mage::helper("orderdetails")->__("Delivery Time"),
            "name" => "delivery_time",
            'readonly' => true
        ));
        $fieldset->addField("special_request", "text", array(
            "label" => Mage::helper("orderdetails")->__("Specail Request"),
            "name" => "special_request",
            'readonly' => true
        ));
        $fieldset->addField("other_contact_number", "text", array(
            "label" => Mage::helper("orderdetails")->__("Alternate Number"),
            "name" => "other_contact_number",
            'readonly' => true
        ));
        $fieldset->addField("message", "text", array(
            "label" => Mage::helper("orderdetails")->__("Message"),
            "name" => "message",
            'readonly' => true
        ));


        if (Mage::getSingleton("adminhtml/session")->getDetailsData()) {
            $form->setValues(Mage::getSingleton("adminhtml/session")->getDetailsData());
            Mage::getSingleton("adminhtml/session")->setDetailsData(null);
        } elseif (Mage::registry("details_data")) {
            $form->setValues(Mage::registry("details_data")->getData());
        }
        return parent::_prepareForm();
    }

}
