<?php
/**
 * Mage SMS - SMS notification & SMS marketing
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the BSD 3-Clause License
 * It is available through the world-wide-web at this URL:
 * http://opensource.org/licenses/BSD-3-Clause
 *
 * @category    TOPefekt
 * @package     TOPefekt_Magesms
 * @copyright   Copyright (c) 2012-2015 TOPefekt s.r.o. (http://www.mage-sms.com)
 * @license     http://opensource.org/licenses/BSD-3-Clause
 */
class Topefekt_Magesms_Model_System_Config_Connector { public function toOptionArray() { return array( array( 'value' => '', 'label' => 'Auto (SSL priority)', ), array( 'value' => 'ssl', 'label' => 'fsockopen (SSL)', ), array( 'value' => 'curl-ssl', 'label' => 'CURL (SSL)', ), array( 'value' => 'no-ssl', 'label' => 'fsockopen (no-SSL)', ), array( 'value' => 'curl', 'label' => 'CURL (no-SSL)', ), ); } } 