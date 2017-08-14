<?php

class Developer_Orderdetails_Block_Adminhtml_Details_Grid extends Mage_Adminhtml_Block_Widget_Grid {

    public function __construct() {
        parent::__construct();
        $this->setId("detailsGrid");
        $this->setDefaultSort("id");
        $this->setDefaultDir("DESC");
        $this->setSaveParametersInSession(true);
    }

    protected function _prepareCollection() {
        $collection = Mage::getModel("orderdetails/details")->getCollection();
        $this->setCollection($collection);
        return parent::_prepareCollection();
    }

    protected function _prepareColumns() {
//        $this->addColumn("id", array(
//            "header" => Mage::helper("orderdetails")->__("ID"),
//            "align" => "right",
//            "width" => "50px",
//            "type" => "number",
//            "index" => "id",
//        ));

        $this->addColumn("order_id", array(
            "header" => Mage::helper("orderdetails")->__("Increment Id"),
            "index" => "order_id",
        ));
        $this->addColumn("customer_id", array(
            "header" => Mage::helper("orderdetails")->__("Customer Id"),
            "index" => "customer_id",
        ));
        $this->addColumn("delivery_date", array(
            "header" => Mage::helper("orderdetails")->__("Delivery Date"),
            "index" => "delivery_date",
        ));
        $this->addColumn("order_date", array(
            "header" => Mage::helper("orderdetails")->__("Delivery Date"),
            "index" => "delivery_date",
        ));
        $this->addColumn("other_contact_number", array(
            "header" => Mage::helper("orderdetails")->__("other contact number"),
            "index" => "other_contact_number",
        ));
        $this->addExportType('*/*/exportCsv', Mage::helper('sales')->__('CSV'));
        $this->addExportType('*/*/exportExcel', Mage::helper('sales')->__('Excel'));

        return parent::_prepareColumns();
    }

    public function getRowUrl($row) {
        return $this->getUrl("*/*/edit", array("id" => $row->getId()));
    }

    protected function _prepareMassaction() {
        $this->setMassactionIdField('id');
        $this->getMassactionBlock()->setFormFieldName('ids');
        $this->getMassactionBlock()->setUseSelectAll(true);
        $this->getMassactionBlock()->addItem('remove_details', array(
            'label' => Mage::helper('orderdetails')->__('Remove Details'),
            'url' => $this->getUrl('*/adminhtml_details/massRemove'),
            'confirm' => Mage::helper('orderdetails')->__('Are you sure?')
        ));
        return $this;
    }

}
