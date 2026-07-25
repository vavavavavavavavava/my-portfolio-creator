/**
 * js/v2/schema.js
 * Portfolio Schema v2の既定値、正規化、旧形式からの移行を提供する。
 */
(function () {
  'use strict';

  const SCHEMA_VERSION = '2.0';
  const STORAGE_KEY = 'mpc.portfolio.v2';
  const PROFICIENCY = new Set(['core', 'working', 'basic']);
  const LAYOUT_HINTS = new Set(['auto', 'full', 'compact', 'visual']);

  function uniqueId(prefix) {
    if (globalThis.crypto?.randomUUID) {
      return `${prefix}-${globalThis.crypto.randomUUID()}`;
    }
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function text(value) {
    return typeof value === 'string' ? value.trim() : '';
  }

  function stringArray(value) {
    if (!Array.isArray(value)) return [];
    return value.map(text).filter(Boolean);
  }

  function createEmpty() {
    return {
      schemaVersion: SCHEMA_VERSION,
      profile: {
        documentTitle: 'キャリアシート',
        name: '',
        nameReading: '',
        professionalTitle: '',
        tagline: '',
        affiliation: ''
      },
      summary: {
        statement: '',
        experienceDomains: [],
        coreCapabilities: [],
        coreTechnologies: [],
        availableRoles: [],
        qualificationHighlights: []
      },
      careerEntries: [],
      projects: [],
      skills: { categories: [] },
      strengths: [],
      certifications: [],
      futureInterests: [],
      presentation: {
        theme: 'business-navy',
        pageSize: 'A4-landscape',
        sectionOrder: ['title', 'summary', 'career', 'projects', 'skills', 'strengths', 'direction']
      }
    };
  }

  function normalizeCareerEntry(entry = {}) {
    return {
      id: text(entry.id) || uniqueId('career'),
      period: {
        from: text(entry.period?.from),
        to: text(entry.period?.to)
      },
      role: text(entry.role),
      organizationLabel: text(entry.organizationLabel || entry.company),
      industry: text(entry.industry),
      summary: text(entry.summary || entry.description),
      highlights: stringArray(entry.highlights || entry.projects)
    };
  }

  function normalizeAchievement(item) {
    if (typeof item === 'string') {
      return { statement: text(item), metric: '', evidence: '' };
    }
    return {
      statement: text(item?.statement || item?.description),
      metric: text(item?.metric),
      evidence: text(item?.evidence)
    };
  }

  function normalizeProcess(item) {
    if (typeof item === 'string') {
      return { label: text(item), description: '' };
    }
    return {
      label: text(item?.label || item?.role),
      description: text(item?.description)
    };
  }

  function normalizeVisual(item) {
    if (typeof item === 'string') {
      return { type: 'image', title: '', src: text(item), alt: '' };
    }
    return {
      type: text(item?.type) || 'image',
      title: text(item?.title),
      src: text(item?.src || item?.image),
      alt: text(item?.alt)
    };
  }

  function normalizeProject(project = {}) {
    const legacyLayoutMap = {
      detail: 'full',
      balance: 'full',
      text: 'full',
      dense: 'compact',
      visual: 'visual'
    };
    const requestedLayout = text(project.layoutHint || legacyLayoutMap[project.layoutMode] || 'auto');

    return {
      id: text(project.id) || uniqueId('project'),
      title: text(project.title || project.projectTitle),
      period: {
        from: text(project.period?.from),
        to: text(project.period?.to)
      },
      role: text(project.role),
      organizationLabel: text(project.organizationLabel),
      summary: text(project.summary || project.overviewText),
      background: text(project.background || project.projectBackground),
      responsibilities: stringArray(project.responsibilities),
      process: Array.isArray(project.process || project.roleMilestones)
        ? (project.process || project.roleMilestones).map(normalizeProcess).filter(item => item.label || item.description)
        : [],
      approaches: stringArray(project.approaches || (project.technicalApproach ? [project.technicalApproach] : [])),
      deliverables: stringArray(project.deliverables || (project.implementationDetails ? [project.implementationDetails] : [])),
      achievements: Array.isArray(project.achievements)
        ? project.achievements.map(normalizeAchievement).filter(item => item.statement || item.metric || item.evidence)
        : [],
      technologies: stringArray(project.technologies || project.techStack),
      team: {
        size: text(project.team?.size || project.teamSize),
        position: text(project.team?.position || project.teamPosition)
      },
      visuals: Array.isArray(project.visuals)
        ? project.visuals.map(normalizeVisual).filter(item => item.src)
        : (project.illustrationImage ? [normalizeVisual(project.illustrationImage)] : []),
      layoutHint: LAYOUT_HINTS.has(requestedLayout) ? requestedLayout : 'auto'
    };
  }

  function proficiencyFromLegacyLevel(level) {
    const numeric = Number(level);
    if (numeric >= 4) return 'core';
    if (numeric >= 2) return 'working';
    return 'basic';
  }

  function normalizeSkill(item = {}) {
    const proficiency = text(item.proficiency) || proficiencyFromLegacyLevel(item.level);
    const years = item.experienceYears === '' || item.experienceYears === null || item.experienceYears === undefined
      ? null
      : Number(item.experienceYears);
    return {
      name: text(item.name),
      proficiency: PROFICIENCY.has(proficiency) ? proficiency : 'basic',
      experienceYears: Number.isFinite(years) ? years : null,
      lastUsed: text(item.lastUsed),
      contexts: stringArray(item.contexts)
    };
  }

  function normalize(data) {
    if (!data || typeof data !== 'object') return createEmpty();
    if (!data.schemaVersion && (data.title || data.technicalcareer || data.career)) {
      data = migrateLegacy(data);
    }

    const empty = createEmpty();
    return {
      schemaVersion: SCHEMA_VERSION,
      profile: {
        documentTitle: text(data.profile?.documentTitle) || empty.profile.documentTitle,
        name: text(data.profile?.name),
        nameReading: text(data.profile?.nameReading),
        professionalTitle: text(data.profile?.professionalTitle),
        tagline: text(data.profile?.tagline),
        affiliation: text(data.profile?.affiliation)
      },
      summary: {
        statement: text(data.summary?.statement),
        experienceDomains: stringArray(data.summary?.experienceDomains),
        coreCapabilities: stringArray(data.summary?.coreCapabilities),
        coreTechnologies: stringArray(data.summary?.coreTechnologies),
        availableRoles: stringArray(data.summary?.availableRoles),
        qualificationHighlights: stringArray(data.summary?.qualificationHighlights)
      },
      careerEntries: Array.isArray(data.careerEntries)
        ? data.careerEntries.map(normalizeCareerEntry).filter(entry =>
            entry.period.from || entry.period.to || entry.role || entry.organizationLabel ||
            entry.industry || entry.summary || entry.highlights.length
          )
        : [],
      projects: Array.isArray(data.projects)
        ? data.projects.map(normalizeProject).filter(project =>
            project.title || project.period.from || project.period.to || project.role ||
            project.organizationLabel || project.summary || project.background ||
            project.responsibilities.length || project.process.length || project.approaches.length ||
            project.deliverables.length || project.achievements.length || project.technologies.length ||
            project.visuals.length
          )
        : [],
      skills: {
        categories: Array.isArray(data.skills?.categories)
          ? data.skills.categories.map(category => ({
              name: text(category.name || category.categoryName),
              items: Array.isArray(category.items)
                ? category.items.map(normalizeSkill).filter(item => item.name)
                : []
            })).filter(category => category.name || category.items.length)
          : []
      },
      strengths: Array.isArray(data.strengths)
        ? data.strengths.map(item => ({
            title: text(item.title),
            description: text(item.description),
            evidence: text(item.evidence),
            relatedProjectIds: stringArray(item.relatedProjectIds)
          })).filter(item => item.title || item.description || item.evidence)
        : [],
      certifications: Array.isArray(data.certifications)
        ? data.certifications.map(item => typeof item === 'string'
            ? { name: text(item), acquiredAt: '', issuer: '' }
            : { name: text(item.name), acquiredAt: text(item.acquiredAt), issuer: text(item.issuer) }
          ).filter(item => item.name)
        : [],
      futureInterests: stringArray(data.futureInterests),
      presentation: {
        theme: 'business-navy',
        pageSize: 'A4-landscape',
        sectionOrder: Array.isArray(data.presentation?.sectionOrder)
          ? data.presentation.sectionOrder.filter(item => typeof item === 'string')
          : empty.presentation.sectionOrder
      }
    };
  }

  function migrateLegacy(legacy) {
    const strengthsBlock = legacy.strengths || {};
    return {
      schemaVersion: SCHEMA_VERSION,
      profile: {
        documentTitle: 'キャリアシート',
        name: legacy.title?.name || '',
        nameReading: legacy.title?.nameReading || '',
        professionalTitle: 'ITエンジニア',
        tagline: '',
        affiliation: legacy.title?.company || ''
      },
      summary: {
        statement: '',
        experienceDomains: [],
        coreCapabilities: [],
        coreTechnologies: [],
        availableRoles: [],
        qualificationHighlights: Array.isArray(strengthsBlock.certifications) ? strengthsBlock.certifications : []
      },
      careerEntries: Array.isArray(legacy.career?.careerHistory) ? legacy.career.careerHistory : [],
      projects: Array.isArray(legacy.technicalcareer)
        ? legacy.technicalcareer
        : (legacy.technicalcareer ? [legacy.technicalcareer] : []),
      skills: {
        categories: Array.isArray(legacy.skills?.categories)
          ? legacy.skills.categories.map(category => ({ name: category.categoryName, items: category.items }))
          : []
      },
      strengths: Array.isArray(strengthsBlock.strengths) ? strengthsBlock.strengths : [],
      certifications: Array.isArray(strengthsBlock.certifications) ? strengthsBlock.certifications : [],
      futureInterests: Array.isArray(strengthsBlock.futureFocus) ? strengthsBlock.futureFocus : [],
      presentation: createEmpty().presentation
    };
  }

  function resolveLayout(project) {
    const requested = project.layoutHint || 'auto';
    const hasVisual = project.visuals?.some(visual => visual.src);
    const detailedScore =
      (project.background ? 1 : 0) +
      Math.min(project.responsibilities?.length || 0, 3) +
      Math.min(project.process?.length || 0, 4) +
      Math.min(project.approaches?.length || 0, 2);

    if (requested === 'visual' && hasVisual) return 'visual';
    if (requested === 'full' && detailedScore >= 3) return 'full';
    if (requested === 'compact') return 'compact';
    if (requested !== 'auto') return detailedScore >= 3 ? 'full' : 'compact';
    if (hasVisual) return 'visual';
    return detailedScore >= 4 ? 'full' : 'compact';
  }

  window.PortfolioSchema = {
    SCHEMA_VERSION,
    STORAGE_KEY,
    createEmpty,
    normalize,
    migrateLegacy,
    resolveLayout,
    uniqueId
  };
})();
