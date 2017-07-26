<?php
/**
 * Intenso Premium Theme
 * 
 * @category    Itactica
 * @package     Itactica_FeaturedProducts
 * @copyright   Copyright (c) 2014 Itactica (http://www.itactica.com)
 * @license     http://getintenso.com/license
 */

class Itactica_FeaturedProducts_Model_Resource_Slider_Collection extends Mage_Core_Model_Resource_Db_Collection_Abstract
{
    protected $_joinedFields = array();
    /**
     * constructor
     * @access public
     * @return void
     */
    protected function _construct(){
        parent::_construct();
        $this->_init('itactica_featuredproducts/slider');
        $this->_map['fields']['store'] = 'store_table.store_id';
    }
    /**
     * Add filter by store
     * @access public
     * @param int|Mage_Core_Model_Store $store
     * @param bool $withAdmin
     * @return Itactica_FeaturedProducts_Model_Resource_Slider_Collection
     */
    public function addStoreFilter($store, $withAdmin = true){
        if (!isset($this->_joinedFields['store'])){
            if ($store instanceof Mage_Core_Model_Store) {
                $store = array($store->getId());
            }
            if (!is_array($store)) {
                $store = array($store);
            }
            if ($withAdmin) {
                $store[] = Mage_Core_Model_App::ADMIN_STORE_ID;
            }
            $this->addFilter('store', array('in' => $store), 'public');
            $this->_joinedFields['store'] = true;
        }
        return $this;
    }
    /**
     * Join store relation table if there is store filter
     * @access protected
     * @return Itactica_FeaturedProducts_Model_Resource_Slider_Collection
     */
    protected function _renderFiltersBefore(){
        if ($this->getFilter('store')) {
            $this->getSelect()->join(
                array('store_table' => $this->getTable('itactica_featuredproducts/slider_store')),
                'main_table.entity_id = store_table.slider_id',
                array()
            )->group('main_table.entity_id');
            /*
             * Allow analytic functions usage because of one field grouping
             */
            $this->_useAnalyticFunction = true;
        }
        return parent::_renderFiltersBefore();
    }
    /**
     * get sliders as array
     * @access protected
     * @param string $valueField
     * @param string $labelField
     * @param array $additional
     * @return array
     */
    protected function _toOptionArray($valueField='entity_id', $labelField='title', $additional=array()){
        return parent::_toOptionArray($valueField, $labelField, $additional);
    }
    /**
     * get options hash
     * @access protected
     * @param string $valueField
     * @param string $labelField
     * @return array
     */
    protected function _toOptionHash($valueField='entity_id', $labelField='title'){
        return parent::_toOptionHash($valueField, $labelField);
    }
    /**
     * add the product filter to collection
     * @access public
     * @param mixed (Mage_Catalog_Model_Product|int) $product
     * @return Itactica_FeaturedProducts_Model_Resource_Slider_Collection
     */
    public function addProductFilter($product){
        if ($product instanceof Mage_Catalog_Model_Product){
            $product = $product->getId();
        }
        if (!isset($this->_joinedFields['product'])){
            $this->getSelect()->join(
                array('related_product' => $this->getTable('itactica_featuredproducts/slider_product')),
                'related_product.slider_id = main_table.entity_id',
                array('position')
            );
            $this->getSelect()->where('related_product.product_id = ?', $product);
            $this->_joinedFields['product'] = true;
        }
        return $this;
    }
    /**
     * add the category filter to collection
     * @access public
     * @param mixed (Mage_Catalog_Model_Category|int) $category
     * @return Itactica_FeaturedProducts_Model_Resource_Slider_Collection
     */
    public function addCategoryFilter($category){
        if ($category instanceof Mage_Catalog_Model_Category){
            $category = $category->getId();
        }
        if (!isset($this->_joinedFields['category'])){
            $this->getSelect()->join(
                array('related_category' => $this->getTable('itactica_featuredproducts/slider_category')),
                'related_category.slider_id = main_table.entity_id',
                array('position')
            );
            $this->getSelect()->where('related_category.category_id = ?', $category);
            $this->_joinedFields['category'] = true;
        }
        return $this;
    }
    /**
     * Get SQL for get record count.
     * Extra GROUP BY strip added.
     * @access public
     * @return Varien_Db_Select
     */
    public function getSelectCountSql(){
        $countSelect = parent::getSelectCountSql();
        $countSelect->reset(Zend_Db_Select::GROUP);
        return $countSelect;
    }
}
