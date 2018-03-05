<?php
/** 
 *
 * @copyright  PayUMoney
 * @license    http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 */

namespace PayUMCitrus\Pumcp\Model;

use Magento\Sales\Model\Order\Payment;
use Magento\Sales\Model\Order\Payment\Transaction;

class PaymentMethod extends \Magento\Payment\Model\Method\AbstractMethod
{
    protected $_code = 'pumcp';
    protected $_isInitializeNeeded = true;

    /**
    * @var \Magento\Framework\Exception\LocalizedExceptionFactory
    */
    protected $_exception;

    /**
    * @var \Magento\Sales\Api\TransactionRepositoryInterface
    */
    protected $_transactionRepository;

    /**
    * @var Transaction\BuilderInterface
    */
    protected $_transactionBuilder;

    /**
    * @var \Magento\Framework\UrlInterface
    */
    protected $_urlBuilder;

    /**
    * @var \Magento\Sales\Model\OrderFactory
    */
    protected $_orderFactory;
	protected $_countryHelper;
    /**
    * @var \Magento\Store\Model\StoreManagerInterface
    */
    protected $_storeManager;
	
	protected $adnlinfo;
	protected $title;

    /**
    * @param \Magento\Framework\UrlInterface $urlBuilder
    * @param \Magento\Framework\Exception\LocalizedExceptionFactory $exception
    * @param \Magento\Sales\Api\TransactionRepositoryInterface $transactionRepository
    * @param Transaction\BuilderInterface $transactionBuilder
    * @param \Magento\Sales\Model\OrderFactory $orderFactory
    * @param \Magento\Store\Model\StoreManagerInterface $storeManager
    * @param \Magento\Framework\Model\Context $context
    * @param \Magento\Framework\Registry $registry
    * @param \Magento\Framework\Api\ExtensionAttributesFactory $extensionFactory
    * @param \Magento\Framework\Api\AttributeValueFactory $customAttributeFactory
    * @param \Magento\Payment\Helper\Data $paymentData
    * @param \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig
    * @param \Magento\Payment\Model\Method\Logger $logger
    * @param \Magento\Framework\Model\ResourceModel\AbstractResource $resource
    * @param \Magento\Framework\Data\Collection\AbstractDb $resourceCollection
    * @param array $data
    */
    public function __construct(
      \Magento\Framework\UrlInterface $urlBuilder,
      \Magento\Framework\Exception\LocalizedExceptionFactory $exception,
      \Magento\Sales\Api\TransactionRepositoryInterface $transactionRepository,
      \Magento\Sales\Model\Order\Payment\Transaction\BuilderInterface $transactionBuilder,
      \Magento\Sales\Model\OrderFactory $orderFactory,
      \Magento\Store\Model\StoreManagerInterface $storeManager,
      \Magento\Framework\Model\Context $context,
      \Magento\Framework\Registry $registry,
      \Magento\Framework\Api\ExtensionAttributesFactory $extensionFactory,
      \Magento\Framework\Api\AttributeValueFactory $customAttributeFactory,
      \Magento\Payment\Helper\Data $paymentData,
      \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig,
      \Magento\Payment\Model\Method\Logger $logger,
      \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
      \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
      array $data = []
    ) {
      $this->_urlBuilder = $urlBuilder;
      $this->_exception = $exception;
      $this->_transactionRepository = $transactionRepository;
      $this->_transactionBuilder = $transactionBuilder;
      $this->_orderFactory = $orderFactory;
      $this->_storeManager = $storeManager;
	  $this->_countryHelper = \Magento\Framework\App\ObjectManager::getInstance()->get('\Magento\Directory\Model\Country');
      parent::__construct(
          $context,
          $registry,
          $extensionFactory,
          $customAttributeFactory,
          $paymentData,
          $scopeConfig,
          $logger,
          $resource,
          $resourceCollection,
          $data
      );
    }

    /**
     * Instantiate state and set it to state object.
     *
     * @param string                        $paymentAction
     * @param \Magento\Framework\DataObject $stateObject
     */
    public function initialize($paymentAction, $stateObject)
    {
        $payment = $this->getInfoInstance();
        $order = $payment->getOrder();
        $order->setCanSendNewEmailFlag(false);		
		
        $stateObject->setState(\Magento\Sales\Model\Order::STATE_PENDING_PAYMENT);
        $stateObject->setStatus('pending_payment');
        $stateObject->setIsNotified(false);
    }

	
	//AA Done
	public function _generateHmacKey($data, $apiKey=null){
		//$hmackey = Zend_Crypt_Hmac::compute($apiKey, "sha1", $data);
		$hmackey = hash_hmac('sha1',$data,$apiKey);
		return $hmackey;
	}

	
	public function getPostHTML($order, $storeId = null)
    {
		$tmpvar = $this->getGateway();
		if($tmpvar == 'payumoney')
		{
			$environment =  $this->getConfigData('environment');
			$pumkey = 		$this->getConfigData('pumkey');	
			$pumsalt =		$this->getConfigData('pumsalt');	
			
			$txnid = $order->getIncrementId();
    	    $amount = $order->getGrandTotal();
        	$amount = number_format((float)$amount, 2, '.', '');
        	
			$action = 'https://secure.payu.in/_payment.php';
			
			if($environment == 'sandbox')
				$action = 'https://sandboxsecure.payu.in/_payment.php';
			
			$currency = $order->getOrderCurrencyCode();
        	$billingAddress = $order->getBillingAddress();
			$productInfo  = "Product Information";	        
			
			$firstname = $billingAddress->getData('firstname');
			$lastname = $billingAddress->getData('lastname');
			$zipcode = $billingAddress->getData('postcode');
			$email = $billingAddress->getData('email');
			$phone = $billingAddress->getData('telephone');
			$address = $billingAddress->getStreet();
        	$state = $billingAddress->getData('region');
        	$city = $billingAddress->getData('city');
        	$country = $billingAddress->getData('country_id');
			$countryObj = $this->_countryHelper->loadByCode($country);
			$country = $countryObj->getName();
			
			$Pg = 'CC';
			$surl = self::getPayUMReturnUrl();
			$furl = self::getPayUMReturnUrl();;
			$curl = self::getPayUMReturnUrl();;
			
			$udf5 = 'Magento_v_2.1';
			
			$hash=hash('sha512', $pumkey.'|'.$txnid.'|'.$amount.'|'.$productInfo.'|'.$firstname.'|'.$email.'|||||'.$udf5.'||||||'.$pumsalt); 
			$user_credentials = $pumkey.':'.$email;		
			$service_provider = 'payu_paisa';
	
			$html = "<form action=\"".$action ."\" method=\"post\" id=\"payu_form\" name=\"payu_form\">
						<input type=\"hidden\" name=\"key\" value=\"". $pumkey. "\" />
						<input type=\"hidden\" name=\"txnid\" value=\"".$txnid."\" />
						<input type=\"hidden\" name=\"amount\" value=\"".$amount."\" />
						<input type=\"hidden\" name=\"productinfo\" value=\"".$productInfo."\" />
						<input type=\"hidden\" name=\"firstname\" value=\"". $firstname."\" />
						<input type=\"hidden\" name=\"Lastname\" value=\"". $lastname."\" />
						<input type=\"hidden\" name=\"Zipcode\" value=\"". $zipcode. "\" />
						<input type=\"hidden\" name=\"email\" value=\"". $email."\" />
						<input type=\"hidden\" name=\"phone\" value=\"".$phone."\" />
						<input type=\"hidden\" name=\"surl\" value=\"". $surl. "\" />
						<input type=\"hidden\" name=\"furl\" value=\"". $furl."\" />
						<input type=\"hidden\" name=\"curl\" value=\"".$curl."\" />
						<input type=\"hidden\" name=\"Hash\" value=\"".$hash."\" />
						<input type=\"hidden\" name=\"Pg\" value=\"". $Pg."\" />
						<input type=\"hidden\" name=\"service_provider\" value=\"". $service_provider ."\" />
						<input type=\"hidden\" name=\"address1\" value=\"".$address[0] ."\" />
				        <input type=\"hidden\" name=\"address2\" value=\"".(isset($address[1])? $address[1] : '') ."\" />
					    <input type=\"hidden\" name=\"city\" value=\"". $city."\" />
				        <input type=\"hidden\" name=\"country\" value=\"".$country."\" />
				        <input type=\"hidden\" name=\"state\" value=\"". $state."\" />
						<input type=\"hidden\" name=\"udf5\" value=\"". $udf5."\" />
				        <button style='display:none' id='submit_payum_payment_form' name='submit_payum_payment_form' >Pay Now</button>
					</form>
					<script type=\"text/javascript\">document.getElementById(\"payu_form\").submit();</script>
					";
					
			return $html;
		}
		else 
		{
		// Citrus Pay
		//$this->_logger->addError("Generate HTML");
		
		$apiKey = $this->getConfigData('apikey');
		$vanityUrl = $this->getConfigData('vanityurl');
		$env = $this->getConfigData('environment');
		
		$returnUrl = self::getReturnUrl();
		$notifyUrl = self::getNotifyUrl();

		$txnid = $order->getIncrementId();	
		$amount = $order->getGrandTotal();	
		$currency = $order->getOrderCurrencyCode();
		$billingAddress = $order->getBillingAddress();;
		$firstName = $billingAddress->getFirstname();
		$lastName = $billingAddress->getLastname();
		$email = $billingAddress->getEmail();
		$street = '';
		$starr = $billingAddress->getStreet();
		if (isset($starr[0]))
		{
			$street = $starr[0];
		}
		$city = $billingAddress->getCity();
		$postcode = $billingAddress->getPostcode();
		$region = $billingAddress->getRegion();
		$country = $billingAddress->getData('country_id');
		$countryObj = $this->_countryHelper->loadByCode($country);
		$country = $countryObj->getName();
		$telephone = $billingAddress->getTelephone();

		//create security signature
		$data = "$vanityUrl$amount$txnid$currency";
		$signatureData = self::_generateHmacKey($data, $apiKey);

		$icpURL = "https://sboxcontext.citruspay.com/kiwi/kiwi-popover";
        
    	    $html = "<form name=\"pumcp-form\" id=\"pumcp-form\" method=\"POST\">
                    <input type=\"hidden\" name=\"pumcp_payment_id\" id=\"pumcp_payment_id\" />
                    <input type=\"hidden\" name=\"merchant_order_id\" id=\"order_id\" value=\"".$txnid."\"/>
                    <input type=\"hidden\" name=\"citrus_ret\" id=\"citrus_ret\" value=\"\"/>
					<button style='display:none' id='submit_citrus_payment_form' name='submit_citrus_payment_form' disabled onclick='launchICP(); return false;'>Pay Now</button>
                </form>";
			
			$js = '<script  type="text/javascript" id="context" src="https://sboxcontext.citruspay.com/static/kiwi/app-js/icp.js"></script>';
            if ($env == "production")
        	{
				 $js = '<script type="text/javascript" id="context" src="https://checkout-static.citruspay.com/kiwi/app-js/icp.min.js"></script>';
			}


        	$js .= "<script>";
        
	        $js .= "
    		function launchICP() {
				
				if(typeof citrusICP == 'undefined') return false;
				
			//enable button
			//document.getElementById('#submit_citrus_payment_form').disabled = false;
        	    
	        var dataObj = {
	            orderAmount:'". $amount."',
	            currency:'". $currency."',
	            phoneNumber:'". $telephone."',
	            email:'". $email."',
	            merchantTxnId:'". $txnid."',
	            secSignature:'". $signatureData."',
	            firstName:'". $firstName."',
	            lastName:'". $lastName."',
	            addressStreet1:'". $street."',
	            addressCity:'". $city."',
	            addressState:'". $region."',
	            addressCountry:'". $country."',
	            addressZip:'". $postcode."',
	            vanityUrl:'". $vanityUrl."',
	            returnUrl:'". $returnUrl."',
				notifyUrl:'". $notifyUrl."',
	            mode:'". "dropAround"."'
	        };
	    ";
		
			$js .="var icpURL ='".$icpURL."';";

			$js .="var configObj = {};";
	        $js .=" configObj = {";
    	    if ($env == "sandbox")
        	{
				$js .=" icpUrl: '".$icpURL."',";
	        }		
			$js .=" 
				eventHandler: function (cbObj) {				
				if (cbObj.event === 'icpLaunched') {
					console.log('Citrus ICP pop-up is launched');
				} else if (cbObj.event === 'icpClosed') {
					console.log(JSON.stringify(cbObj.message));				
				 	console.log('Citrus ICP pop-up is closed');
				 }
			  } 
			};
		";
        
			$js .="  try {
	            citrusICP.launchIcp(dataObj, configObj);
	        }
	        catch (error) {
	            console.log(error);
	        }
	    }";
     
				
    	    $js .= 'var checkoutOrderBtn = jQuery("button.btn-checkout");
                if(checkoutOrderBtn.length == 0)  checkoutOrderBtn = jQuery("button:contains(\'Place Order\')");
                checkoutOrderBtn[0].removeAttribute("onclick");
                checkoutOrderBtn[0].click(launchICP);				
				jQuery(\'.loading-mask\').css(\'display\',\'none\');
                ';
                
        	$js .="console.log('start timer');";
        
	        $js .= "setTimeout(launchICP, 2500);";
        
    	    $js .= '</script>';

		//$this->_logger->addError("Citru Generated HTML ".$html);
		
		//$this->_logger->addError("Generated Citrus checkout for order $txnid");
		
		return $html.$js;
		}
    }

    public function getOrderPlaceRedirectUrl($storeId = null)
    {
        return $this->_getUrl('pumcp/checkout/start', $storeId);
    }

	protected function addHiddenField($arr)
	{
		$nm = $arr['name'];
		$vl = $arr['value'];	
		$input = "<input name='".$nm."' type='hidden' value='".$vl."' />";	
		
		return $input;
	}
	
	public function getTitle()
	{
		$tmpvar = $this->getGateway();
		return $this->title;
	}
	
	/**
     * Get  Gateway PayUM or Citrus.
     *
     * @param int|null $storeId
     *
     * @return string
     */
	public function getGateway()
	{
		$active =       $this->getConfigData('active');
        $env = 			$this->getConfigData('environment');
		$pumkey = 		$this->getConfigData('pumkey');	
		$pumsalt =		$this->getConfigData('pumsalt');	
		$cvurl =		$this->getConfigData('vanityurl');	
		$caccess =		$this->getConfigData('accesskey');	
		$csecret =		$this->getConfigData('apikey');	
		$pumroute =		$this->getConfigData('routepum');	
		$croute =		$this->getConfigData('routecitrus');	
		
		if(empty($pumkey) && empty($pumsalt) && empty($cvurl) && empty($caccess) && empty($csecret))
		{
            //Mage::log('Pumcp empty configuration, either PayUMoney or Citrus needs to be configured.', Zend_Log::EMERG);
            $this->title = 'PayUMoney and Citrus ICP Combiled (Invalid configuration)';
            return ($this->adnlinfo='');			
		}
		
		if(!(empty($pumkey) && empty($pumsalt) && empty($cvurl) && empty($caccess) && empty($csecret)) && ($pumroute + $croute) != 100)
		{
			//Mage::log('Pumcp Routing values not properly configured.', Zend_Log::EMERG); 
			$this->title = 'PayUMoney and Citrus ICP Combiled (Invalid configuration)';
            return ($this->adnlinfo='');
		}
		//Choose either of the gateway as per configuration
		
		if(!empty($pumkey) && !empty($pumsalt) && empty($cvurl) && empty($caccess) && empty($csecret))
		{
			$this->adnlinfo = 'payumoney';
			$this->title = 'PayU Money';
			return $this->adnlinfo;
		}
		elseif(empty($pumkey) && empty($pumsalt) && !empty($cvurl) && !empty($caccess) && !empty($csecret))
		{
			$this->adnlinfo = 'citruspay';
			$this->title = 'Citrus Pay';
			return $this->adnlinfo;
		}
		
		//read db for %age
		$pCitrus=0;
		$pPayu=0;
		
		$objectManager = \Magento\Framework\App\ObjectManager::getInstance(); 
		$resource = $objectManager->get('Magento\Framework\App\ResourceConnection');
		$connection = $resource->getConnection();

		$query = "SELECT COUNT(*) / T.total * 100 AS percentPayU 
FROM sales_order_payment as I , (SELECT COUNT(*) AS total 
FROM sales_order_payment where amount_paid > 0) AS T 
WHERE method = 'pumcp' and additional_information like '%payumoney%' and amount_paid > 0";
		
		$result = $connection->fetchAll($query); 
		//$dump = print_r($result);
		////Mage::log($dump, Zend_Log::EMERG);
		$pPayu = $result[0]['percentPayU'];
        
		
		$query = "SELECT COUNT(*) / T.total * 100 AS percentCitrus 
FROM sales_order_payment as I , (SELECT COUNT(*) AS total 
FROM sales_order_payment where amount_paid > 0) AS T 
WHERE method = 'pumcp' and additional_information like '%citruspay%' and amount_paid > 0";
		
		$result = $connection->fetchAll($query); 
        $pCitrus = $result[0]['percentCitrus'];
        
		
		if($pCitrus > $croute && $pPayu <= $pumroute) {
			$this->adnlinfo = 'payumoney';
			$this->title = 'PayU Money';
		}
		elseif($pCitrus <= $croute && $pPayu  >$pumroute) {
			$this->adnlinfo = 'citruspay';
			$this->title = 'Citrus Pay';
		}
		else {
			if($pPayu >= $pCitrus) {
				$this->adnlinfo = 'citruspay';
				$this->title = 'Citrus Pay';
			}
			else
			{
				$this->adnlinfo = 'payumoney';					
				$this->title = 'PayU Money';
			}
		}
		return $this->adnlinfo;
	}
	
    /**
     * Get return URL.
     *
     * @param int|null $storeId
     *
     * @return string
     */
	 //AA may not be required
    public function getSuccessUrl($storeId = null)
    {
        return $this->_getUrl('checkout/onepage/success', $storeId);
    }

	/**
     * Get notify (IPN) URL.
     *
     * @param int|null $storeId
     *
     * @return string
     */
	 //AA Done
    public function getReturnUrl($storeId = null)
    {
        return $this->_getUrl('pumcp/ipn/callback', $storeId, false);
    }
	
	 public function getPayUMReturnUrl($storeId = null)
    {
        return $this->_getUrl('pumcp/ipn/callbackpayum', $storeId, false);
    }
	
    /**
     * Get notify (IPN) URL.
     *
     * @param int|null $storeId
     *
     * @return string
     */
	 //AA Done
    public function getNotifyUrl($storeId = null)
    {
        return $this->_getUrl('pumcp/ipn/callback', $storeId, false);
    }

    /**
     * Get cancel URL.
     *
     * @param int|null $storeId
     *
     * @return string
     */
	 //AA Not required
    public function getCancelUrl($storeId = null)
    {
        return $this->_getUrl('checkout/onepage/failure', $storeId);
    }

	/**
     * Get cancel URL.
     *
     * @param int|null $storeId
     *
     * @return string
     */
	 //AA Done
    public function getEnquirylUrl($txnid, $storeId = null)
    {
        return $this->_getUrl('pumcp/checkout/enquiry', $storeId).'/txnid/'.$txnid;
    }
	
    /**
     * Build URL for store.
     *
     * @param string    $path
     * @param int       $storeId
     * @param bool|null $secure
     *
     * @return string
     */
	 //AA Done
    protected function _getUrl($path, $storeId, $secure = null)
    {
        $store = $this->_storeManager->getStore($storeId);

        return $this->_urlBuilder->getUrl(
            $path,
            ['_store' => $store, '_secure' => $secure === null ? $store->isCurrentlySecure() : $secure]
        );
    }
}
