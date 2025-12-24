/**
 * FAQ Generator - Generate context-specific FAQs based on address labels and entity types
 * Used to improve SEO with relevant, label-specific questions
 */

import type { AddressLabel, LabeledAddress, NameRecord, Entity } from './types';

export interface FAQ {
	question: string;
	answer: string;
}

// Label category groups for determining which FAQs to show
const DEFI_LABELS: AddressLabel[] = [
	'defi',
	'lending',
	'bridge',
	'yield',
	'derivatives',
	'liquid-staking'
];
const TOKEN_LABELS: AddressLabel[] = ['token', 'stablecoin', 'memecoin', 'wrapped'];
const RISK_LABELS: AddressLabel[] = ['hacker', 'scam', 'sanctioned', 'phishing'];

/**
 * Check if address has any of the specified labels
 */
function hasLabel(labels: AddressLabel[], checkLabels: AddressLabel[]): boolean {
	return labels.some((l) => checkLabels.includes(l));
}

/**
 * Generate FAQs for an address based on its labels and entity
 */
import type { TranslationKeys } from '@shelchin/i18n';

export function generateAddressFAQs(
	address: LabeledAddress,
	entity: Entity,
	chainName: string,
	t: (key: keyof TranslationKeys, params?: Record<string, string | number>) => string
): FAQ[] {
	const faqs: FAQ[] = [];
	const { labels, riskLevel, name: addressName } = address;

	// 1. Basic "What is" question (always shown)
	faqs.push({
		question: t('address.faq.what_is', { name: addressName }),
		answer: t('address.faq.what_is_answer', {
			name: addressName,
			entity: entity.name,
			chain: chainName
		})
	});

	// 2. Safety question (always shown, answer varies by risk level)
	faqs.push({
		question: t('address.faq.is_safe'),
		answer: t(`address.faq.is_safe_answer_${riskLevel}`, { name: addressName })
	});

	// 3. Category-specific FAQs based on labels
	if (hasLabel(labels, ['cex'])) {
		faqs.push({
			question: t('address.faq.cex.can_deposit'),
			answer: t('address.faq.cex.can_deposit_answer', { name: addressName, entity: entity.name })
		});
	}

	if (hasLabel(labels, ['dex'])) {
		faqs.push({
			question: t('address.faq.dex.what_is_contract'),
			answer: t('address.faq.dex.what_is_contract_answer', {
				name: addressName,
				entity: entity.name
			})
		});
	}

	if (hasLabel(labels, DEFI_LABELS)) {
		faqs.push({
			question: t('address.faq.defi.what_does_it_do'),
			answer: t('address.faq.defi.what_does_it_do_answer', {
				name: addressName,
				entity: entity.name
			})
		});
	}

	if (hasLabel(labels, ['lending'])) {
		faqs.push({
			question: t('address.faq.defi.lending_how'),
			answer: t('address.faq.defi.lending_how_answer', { entity: entity.name })
		});
	}

	if (hasLabel(labels, ['bridge'])) {
		faqs.push({
			question: t('address.faq.defi.bridge_how'),
			answer: t('address.faq.defi.bridge_how_answer', { name: addressName, entity: entity.name })
		});
	}

	if (hasLabel(labels, ['liquid-staking'])) {
		faqs.push({
			question: t('address.faq.defi.staking_how'),
			answer: t('address.faq.defi.staking_how_answer', { entity: entity.name })
		});
	}

	if (hasLabel(labels, TOKEN_LABELS)) {
		faqs.push({
			question: t('address.faq.token.what_is_contract'),
			answer: t('address.faq.token.what_is_contract_answer', { name: addressName })
		});
	}

	if (hasLabel(labels, ['stablecoin'])) {
		faqs.push({
			question: t('address.faq.token.stablecoin_peg'),
			answer: t('address.faq.token.stablecoin_peg_answer', { name: addressName })
		});
	}

	if (hasLabel(labels, ['whale', 'smart-money'])) {
		faqs.push({
			question: t('address.faq.entity.whale_activity'),
			answer: t('address.faq.entity.whale_activity_answer', { name: addressName })
		});
	}

	if (hasLabel(labels, ['multisig'])) {
		faqs.push({
			question: t('address.faq.entity.multisig_what'),
			answer: t('address.faq.entity.multisig_what_answer', { name: addressName })
		});
	}

	if (hasLabel(labels, ['dao', 'foundation'])) {
		faqs.push({
			question: t('address.faq.entity.governance'),
			answer: t('address.faq.entity.governance_answer', { name: addressName, entity: entity.name })
		});
	}

	if (hasLabel(labels, RISK_LABELS)) {
		faqs.push({
			question: t('address.faq.risk.why_flagged'),
			answer: t('address.faq.risk.why_flagged_answer', { name: addressName })
		});
		faqs.push({
			question: t('address.faq.risk.what_to_do'),
			answer: t('address.faq.risk.what_to_do_answer')
		});
	}

	if (hasLabel(labels, ['contract'])) {
		faqs.push({
			question: t('address.faq.contract.is_verified'),
			answer: t('address.faq.contract.is_verified_answer', { name: addressName, chain: chainName })
		});
	}

	// 4. How to verify (always shown as last)
	faqs.push({
		question: t('address.faq.how_to_verify'),
		answer: t('address.faq.how_to_verify_answer', { explorer: chainName })
	});

	return faqs;
}

/**
 * Generate FAQs for a name (ENS/other domain) based on its type and associated data
 */
export function generateNameFAQs(
	name: NameRecord,
	entity: Entity | undefined,
	nameTypeLabel: string,
	hasExpiry: boolean,
	hasSocialLinks: boolean,
	t: (key: string, params?: Record<string, string | number>) => string
): FAQ[] {
	const faqs: FAQ[] = [];
	const { name: domainName, type, address } = name;

	// 1. Basic "What is" question
	faqs.push({
		question: t('name.faq.what_is', { name: domainName }),
		answer: t('name.faq.what_is_answer', { name: domainName, type: nameTypeLabel })
	});

	// 2. How to use
	faqs.push({
		question: t('name.faq.how_to_use'),
		answer: t('name.faq.how_to_use_answer', { name: domainName })
	});

	// 3. Ownership question (if resolved)
	if (address) {
		faqs.push({
			question: t('name.faq.who_owns'),
			answer: t('name.faq.who_owns_answer', {
				name: domainName,
				address: `${address.slice(0, 10)}...${address.slice(-6)}`
			})
		});
	}

	// 4. ENS-specific FAQs
	if (type === 'ens') {
		if (hasExpiry) {
			faqs.push({
				question: t('name.faq.ens.can_expire'),
				answer: t('name.faq.ens.can_expire_answer', { name: domainName })
			});
			faqs.push({
				question: t('name.faq.ens.how_to_renew'),
				answer: t('name.faq.ens.how_to_renew_answer', { name: domainName })
			});
		}

		faqs.push({
			question: t('name.faq.ens.how_to_set_records'),
			answer: t('name.faq.ens.how_to_set_records_answer', { name: domainName })
		});

		if (hasSocialLinks) {
			faqs.push({
				question: t('name.faq.ens.what_are_records'),
				answer: t('name.faq.ens.what_are_records_answer')
			});
		}
	}

	// 5. Entity-specific (if known entity)
	if (entity) {
		faqs.push({
			question: t('name.faq.entity.who_is_owner'),
			answer: t('name.faq.entity.who_is_owner_answer', { name: domainName, entity: entity.name })
		});
	}

	// 6. General domain FAQs
	faqs.push({
		question: t('name.faq.how_to_buy'),
		answer: t('name.faq.how_to_buy_answer', { type: nameTypeLabel })
	});

	return faqs;
}
