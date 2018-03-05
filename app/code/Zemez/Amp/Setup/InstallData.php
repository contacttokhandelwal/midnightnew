<?php

namespace Zemez\Amp\Setup;

use Magento\Framework\App\State;
use Magento\Cms\Model\Block;
use Magento\Cms\Model\BlockFactory;
use Magento\Cms\Model\Page;
use Magento\Cms\Model\PageFactory;
use Magento\Framework\Setup\InstallDataInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\ModuleDataSetupInterface;

/**
 * @codeCoverageIgnore
 */
class InstallData implements InstallDataInterface
{
    /**
     * Block Factory
     * @var \Magento\Cms\Model\BlockFactory
     */
    private $_blockFactory;

    /**
     * Page Factory
     *
     * @var \Magento\Cms\Model\PageFactory
     */
    private $_pageFactory;

    /**
     * Init
     * @param \Magento\Cms\Model\BlockFactory $blockFactory and \Magento\Cms\Model\PageFactory $pageFactory
     */
    public function __construct(
        \Magento\Cms\Model\BlockFactory $blockFactory,
        \Magento\Cms\Model\PageFactory $pageFactory
    ) {
        $this->_blockFactory = $blockFactory;
        $this->_pageFactory = $pageFactory;
    }
    /**
     * {@inheritdoc}
     * @SuppressWarnings(PHPMD.ExcessiveMethodLength)
     */
    public function install(ModuleDataSetupInterface $setup, ModuleContextInterface $context)
    {
        $block = $this->_blockFactory->create();
        $blockIdentifier = \Zemez\Amp\Helper\Data::AMP_FOOTER_LINKS_KEYWORD;
        $block->setStoreId(0)->load($blockIdentifier);

        if (!$block->getId()) {
            $blockContent = '<ul>'
                .'<li><a href="{{store url=\'about-us\'}}">About Us</a></li>'
                .'<li><a href="{{store url=\'contact\'}}">Contact Us</a></li>'
                .'<li><a href="{{store url=\'customer-service\'}}">Customer Service</a></li>'
                .'<li><a href="{{store url=\'privacy-policy-cookie-restriction-mode\'}}">Privacy Policy</a></li>'
                .'<li><a href="{{store url=\'template-settings\'}}">Templates Settings</a></li>'
                .'</ul>';

            $footerBlockData = [
                \Magento\Cms\Model\Block::IDENTIFIER => $blockIdentifier,
                \Magento\Cms\Model\Block::TITLE => 'AMP Footer Links',
                \Magento\Cms\Model\Block::CONTENT => $blockContent,
                \Magento\Cms\Model\Block::IS_ACTIVE => true,
                'page_layout' => '1column',
                'stores' => [0],
            ];

            $block->setData($footerBlockData)->save();
        }
    }
}