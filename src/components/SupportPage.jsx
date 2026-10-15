import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Check,
  Copy,
  ChevronDown
} from 'lucide-react';
import {
  PayPalIcon,
  BuyMeACoffeeIcon,
  EthereumIcon,
  UsdtIcon,
  UsdcIcon,
  SolanaIcon
} from './Icons';
import { sound } from '../utils/soundEffects';
import { haptic } from '../utils/haptic';
import './SupportPage.css';

/**
 * Dedicated /support page
 * Modeled after https://www.manishx.in/support
 */
export default function SupportPage({
  supportData = {},
  showToast
}) {
  const [copiedKey, setCopiedKey] = useState(null);
  const copyTimerRef = useRef(null);

  // Scroll to top upon mounting
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.title = 'Support // Ayush Aryan';
    return () => {
      document.title = 'Ayush Aryan // Product Engineer & Design Architect';
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const handleCopy = useCallback((text, key, label) => {
    haptic(45);
    sound.playSuccess();
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(text);
      }
    } catch {
      // fallback handled
    }
    setCopiedKey(key);
    if (showToast) {
      showToast(`${label} copied`, 'success');
    }
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => {
      setCopiedKey(null);
    }, 2200);
  }, [showToast]);

  // Crypto Coin Icon Resolver
  const getCoinIcon = (coinKey) => {
    switch (coinKey) {
      case 'ETH':
        return <EthereumIcon size={18} />;
      case 'USDT':
        return <UsdtIcon size={18} />;
      case 'USDC':
        return <UsdcIcon size={18} />;
      case 'SOL':
        return <SolanaIcon size={18} />;
      default:
        return <EthereumIcon size={18} />;
    }
  };

  // Crypto state
  const cryptoList = supportData.crypto || [];
  const [selectedCoinKey, setSelectedCoinKey] = useState(cryptoList[0]?.key || 'ETH');

  const activeCoin = cryptoList.find((c) => c.key === selectedCoinKey) || cryptoList[0] || {};
  const availableNetworks = activeCoin.networks || [];

  const [selectedNetwork, setSelectedNetwork] = useState(() => {
    return availableNetworks[0] || '';
  });

  // Keep network selection valid when coin changes
  const handleCoinChange = (coinKey) => {
    sound.playClick();
    setSelectedCoinKey(coinKey);
    const targetCoin = cryptoList.find((c) => c.key === coinKey);
    if (targetCoin?.networks && targetCoin.networks.length > 0) {
      setSelectedNetwork(targetCoin.networks[0]);
    }
  };

  // Resolve current active address and badge
  const addressInfo = activeCoin.networks
    ? activeCoin.addresses?.[selectedNetwork] || { badge: selectedNetwork, address: '' }
    : { badge: activeCoin.badge || activeCoin.label, address: activeCoin.address || '' };

  const currentAddress = addressInfo.address || '';
  const currentBadge = addressInfo.badge || selectedNetwork || activeCoin.label || '';

  // Dropdown open states & drop-up positioning
  const [isCoinDropdownOpen, setIsCoinDropdownOpen] = useState(false);
  const [isNetworkDropdownOpen, setIsNetworkDropdownOpen] = useState(false);
  const [coinDropUp, setCoinDropUp] = useState(true);
  const [networkDropUp, setNetworkDropUp] = useState(true);

  const coinDropdownRef = useRef(null);
  const networkDropdownRef = useRef(null);

  // Close dropdowns on outside clicks
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (coinDropdownRef.current && !coinDropdownRef.current.contains(e.target)) {
        setIsCoinDropdownOpen(false);
      }
      if (networkDropdownRef.current && !networkDropdownRef.current.contains(e.target)) {
        setIsNetworkDropdownOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleOutsideClick);
    return () => document.removeEventListener('pointerdown', handleOutsideClick);
  }, []);

  // Ensure page remains steady when dropdowns close
  useEffect(() => {
    if (!isCoinDropdownOpen && !isNetworkDropdownOpen) {
      if (window.scrollY > 0 && window.innerWidth > 700) {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    }
  }, [isCoinDropdownOpen, isNetworkDropdownOpen]);

  const toggleCoinDropdown = () => {
    sound.playClick();
    if (!isCoinDropdownOpen && coinDropdownRef.current) {
      const rect = coinDropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      // Default to drop-up to prevent adding height to document bottom
      setCoinDropUp(spaceBelow < 210 || spaceAbove > spaceBelow);
    }
    setIsCoinDropdownOpen((prev) => !prev);
    setIsNetworkDropdownOpen(false);
  };

  const toggleNetworkDropdown = () => {
    sound.playClick();
    if (!isNetworkDropdownOpen && networkDropdownRef.current) {
      const rect = networkDropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setNetworkDropUp(spaceBelow < 210 || spaceAbove > spaceBelow);
    }
    setIsNetworkDropdownOpen((prev) => !prev);
    setIsCoinDropdownOpen(false);
  };

  // Quick Support Platforms
  const quickPlatforms = (supportData.quickSupport || []).map((item) => {
    let icon = <BuyMeACoffeeIcon size={18} />;
    if (item.label.includes('PayPal')) {
      icon = <PayPalIcon size={18} />;
    }
    return { ...item, icon };
  });

  return (
    <div className="support-layout">
      <div className="support-container">
        {/* Page Header */}
        <div className="support-header-wrap">
          <h1 className="support-title-badge">
            <span className="support-title-slash">//</span>
            <span>support</span>
          </h1>
        </div>

        {/* 1. Quick Support Section */}
        <section className="support-section">
          <h2 className="support-section-title">Quick Support</h2>

          <div className="support-quick-grid">
            {quickPlatforms.map((platform) => {
              const isCopied = copiedKey === `quick-${platform.label}`;
              return (
                <div key={platform.label} className="support-quick-card-wrap">
                  <a
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="support-quick-card"
                    onMouseEnter={() => sound.playCardHover()}
                    onClick={() => sound.playClick()}
                  >
                    <span className="support-quick-icon" aria-hidden="true">
                      {platform.icon}
                    </span>
                    <span className="support-quick-label">{platform.label}</span>
                    <span className="support-quick-subtext">{platform.subtext}</span>
                  </a>

                  {/* Copy Link Button */}
                  <button
                    type="button"
                    className={`support-quick-copy ${isCopied ? 'support-quick-copy-copied' : ''}`}
                    onMouseEnter={() => sound.playHover()}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCopy(platform.url, `quick-${platform.label}`, `${platform.label} link`);
                    }}
                    title={isCopied ? 'Link copied!' : `Copy ${platform.label} link`}
                    aria-label={`Copy ${platform.label} link`}
                  >
                    {isCopied ? <Check size={13} /> : <Copy size={13} />}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* 2. Crypto Direct Transfers Section */}
        <section className="support-section">
          <h2 className="support-section-title">Crypto</h2>

          {/* Select Dropdowns Row */}
          <div className={`support-select-row ${availableNetworks.length > 0 ? 'support-select-row-networks' : ''}`}>
            {/* Coin Dropdown */}
            <div className="support-select" ref={coinDropdownRef}>
              <span className="support-select-label">Coin</span>
              <button
                type="button"
                className="support-select-trigger"
                aria-expanded={isCoinDropdownOpen}
                onMouseEnter={() => sound.playHover()}
                onClick={toggleCoinDropdown}
              >
                <span className="support-select-trigger-icon" aria-hidden="true">
                  {getCoinIcon(activeCoin.key)}
                </span>
                <span>{activeCoin.label || activeCoin.key}</span>
                <ChevronDown className="support-select-chevron" size={15} />
              </button>

              {isCoinDropdownOpen && (
                <ul
                  className={`support-select-listbox overflow-y-auto ${coinDropUp ? 'support-select-listbox-dropup' : ''}`}
                  role="listbox"
                  data-lenis-prevent
                  onWheel={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                >
                  {cryptoList.map((coin) => {
                    const isSelected = coin.key === selectedCoinKey;
                    return (
                      <li
                        key={coin.key}
                        role="option"
                        aria-selected={isSelected}
                        className={`support-select-option ${isSelected ? 'support-select-option-selected' : ''}`}
                        onMouseEnter={() => sound.playHover()}
                        onClick={() => {
                          handleCoinChange(coin.key);
                          setIsCoinDropdownOpen(false);
                        }}
                      >
                        <span className="support-select-option-icon" aria-hidden="true">
                          {getCoinIcon(coin.key)}
                        </span>
                        <span>{coin.label || coin.key}</span>
                        {isSelected && <Check className="support-select-check" size={14} />}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Network Dropdown (Only when coin has multiple networks) */}
            {availableNetworks.length > 0 && (
              <div className="support-select" ref={networkDropdownRef}>
                <span className="support-select-label">Network</span>
                <button
                  type="button"
                  className="support-select-trigger"
                  aria-expanded={isNetworkDropdownOpen}
                  onMouseEnter={() => sound.playHover()}
                  onClick={toggleNetworkDropdown}
                >
                  <span>{selectedNetwork}</span>
                  <ChevronDown className="support-select-chevron" size={15} />
                </button>

                {isNetworkDropdownOpen && (
                  <ul
                    className={`support-select-listbox overflow-y-auto ${networkDropUp ? 'support-select-listbox-dropup' : ''}`}
                    role="listbox"
                    data-lenis-prevent
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                  >
                    {availableNetworks.map((net) => {
                      const isSelected = net === selectedNetwork;
                      return (
                        <li
                          key={net}
                          role="option"
                          aria-selected={isSelected}
                          className={`support-select-option ${isSelected ? 'support-select-option-selected' : ''}`}
                          onMouseEnter={() => sound.playHover()}
                          onClick={() => {
                            sound.playClick();
                            setSelectedNetwork(net);
                            setIsNetworkDropdownOpen(false);
                          }}
                        >
                          <span>{net}</span>
                          {isSelected && <Check className="support-select-check" size={14} />}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Wallet Address Display Box */}
          <div className="support-address-box">
            <div className="support-address-row">
              <span className="support-badge">{currentBadge}</span>
              <span className="support-address" title={currentAddress}>
                {currentAddress}
              </span>

              <div className="support-copy-wrap">
                <button
                  type="button"
                  className={`support-copy-btn ${copiedKey === 'crypto' ? 'support-copy-btn-copied' : ''}`}
                  onMouseEnter={() => sound.playHover()}
                  onClick={() => handleCopy(currentAddress, 'crypto', 'Wallet address')}
                  title={copiedKey === 'crypto' ? 'Address copied!' : 'Copy wallet address'}
                  aria-label="Copy wallet address"
                >
                  {copiedKey === 'crypto' ? <Check size={15} /> : <Copy size={15} />}
                </button>
                {copiedKey === 'crypto' && <span className="support-copy-status">Copied</span>}
              </div>
            </div>

          </div>

          <p className="support-crypto-note">
            Double-check the network before sending — sending on the wrong network may result in loss of funds.
          </p>
        </section>
      </div>
    </div>
  );
}
