<?php

class Developer_Orderdetails_CustomizecakeController extends Mage_Core_Controller_Front_Action {

    public function indexAction() {

        $this->loadLayout();
        $this->getLayout()->getBlock("head")->setTitle($this->__("Create your custom cake"));
        $breadcrumbs = $this->getLayout()->getBlock("breadcrumbs");
        $breadcrumbs->addCrumb("home", array(
            "label" => $this->__("Home Page"),
            "title" => $this->__("Home Page"),
            "link" => Mage::getBaseUrl()
        ));

        $breadcrumbs->addCrumb("Create your custom cake", array(
            "label" => $this->__("Create your custom cake"),
            "title" => $this->__("Create your custom cake")
        ));

        $this->renderLayout();
    }

    public function saveOrderDataAction() {
        $p = $this->getRequest()->getPost();
        $orderDetails = Mage::getModel('orderdetails/details')->addData($p);
        $orderDetails->save();
        Mage::getSingleton('checkout/session')->addSuccess($this->__('Your information has been saved successfully.'));
        $this->_redirect('/');
    }

    public function customCakesAction() {

        $this->loadLayout();
        $this->getLayout()->getBlock("head")->setTitle($this->__("Create your custom cake"));
        $breadcrumbs = $this->getLayout()->getBlock("breadcrumbs");
        $breadcrumbs->addCrumb("home", array(
            "label" => $this->__("Home Page"),
            "title" => $this->__("Home Page"),
            "link" => Mage::getBaseUrl()
        ));

        $breadcrumbs->addCrumb("Create your custom cake", array(
            "label" => $this->__("Create your custom cake"),
            "title" => $this->__("Create your custom cake")
        ));

        $this->renderLayout();
    }

    public function saveCakeAction() {
        //$uploadfile =  Mage::getBaseDir('media') . DS . 'img' . DS . basename($_FILES['image']['name']);
        //move_uploaded_file($_FILES['image']['tmp_name'], $uploadfile );
        try {
            $uploader = new Varien_File_Uploader('image');

            $uploader->setAllowedExtensions(array('jpg', 'jpeg', 'gif', 'png'));
            $uploader->setAllowRenameFiles(false);
            $uploader->setFilesDispersion(false);
            $path = Mage::getBaseDir('media') . DS . 'img' . DS;
            $name = time() . $_FILES['image']['name'];
            $uploader->save($path, $name);
            $imgURL = $path . $name;
            $productId = $this->createProduct($this->getRequest()->getPost(), $imgURL);
            $this->addProductToCart($productId);
        } catch (Exception $e) {
            print_r($e);
        }


        Mage::getSingleton('checkout/session')->addSuccess($this->__('Your information has been saved successfully. And product is added to your cart'));
        $this->_redirect('checkout/cart');
    }

    public function createProduct($data, $img) {
        Mage::app()->setCurrentStore(Mage_Core_Model_App::ADMIN_STORE_ID);
        $product = Mage::getModel('catalog/product');
//    if(!$product->getIdBySku('testsku61')):

        try {
            $product
                    ->setStoreId(1) //you can set data in store scope
                    ->setWebsiteIds(array(1)) //website ID the product is assigned to, as an array
                    ->setAttributeSetId(12) //ID of a attribute set named 'default'
                    ->setTypeId('virtual') //product type
                    ->setCreatedAt(strtotime('now')) //product creation time
                    ->setUpdatedAt(strtotime('now')) //product update time
                    ->setSku($data['sku']) //SKU
                    ->setShortdescription($data['name']) //SKU
                    ->setDescription($data['name']) //SKU
                    ->setCakeType($data['cake_type']) //SKU
                    ->setName($data['name']) //product name
                    ->setWeight(0.5)
                    ->setStatus(1) //product status (1 - enabled, 2 - disabled)
                    ->setTaxClassId(4) //tax class (0 - none, 1 - default, 2 - taxable, 4 - shipping)
                    ->setVisibility(2) //catalog and search visibility
                    ->setCountryOfManufacture('IN') //country of manufacture (2-letter country code)
                    ->setPrice(500) //price in form 11.22
                    ->setMetaKeyword($data['name'])
                    ->setMediaGallery(
                            array('images' => array(), 'values' => array())) //media gallery initialization
                    ->addImageToMediaGallery($img, array('cake_image', 'image', 'thumbnail', 'small_image'), false, false) //assigning image, thumb and small image to media gallery
                    ->setStockData(array(
                        'use_config_manage_stock' => 0, //'Use config settings' checkbox
                        'manage_stock' => 0, //manage stock
                        'is_in_stock' => 1, //Stock Availability
                        'qty' => 999 //qty
                            )
                    )
                    ->setCategoryIds(array(127)); //assign product to categories
            $product->save();
            return $product->getId();
        } catch (Exception $e) {
            print_r($e);
            exit;
            Mage::log($e->getMessage());
        }
    }

    public function addProductToCart($productId) {
        Mage::app()->setCurrentStore(Mage_Core_Model_App::DISTRO_STORE_ID);
        $product = Mage::getModel('catalog/product')->load($productId);
        $cart = Mage::getSingleton('checkout/cart');
        $cart->init();
        $product = Mage::getModel('catalog/product')->load($productId);

        $paramater = array('product_id' => $productId,
            'qty' => '1',
            'form_key' => Mage::getSingleton('core/session')->getFormKey(),
            'options' => []
        );

        $cart->addProduct($product, $paramater);
        $cart->save();
        return;
    }

}
