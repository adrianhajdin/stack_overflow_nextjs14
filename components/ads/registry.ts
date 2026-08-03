import type { AdTemplate } from '@/types/ads'
import TeachMoreKeepMore, {
  TEACH_MORE_KEEP_MORE_COPY,
} from './templates/TeachMoreKeepMore'
import YourSkillsYourIncome, {
  YOUR_SKILLS_YOUR_INCOME_COPY,
} from './templates/YourSkillsYourIncome'
import LearnWithGreatTutors, {
  LEARN_WITH_GREAT_TUTORS_COPY,
} from './templates/LearnWithGreatTutors'
import FairerPlatform, { FAIRER_PLATFORM_COPY } from './templates/FairerPlatform'
import MoreChoiceBetterLearning, {
  MORE_CHOICE_COPY,
} from './templates/MoreChoiceBetterLearning'
import StudentPoster, { STUDENT_POSTER_COPY } from './templates/StudentPoster'
import TutorSpotlight, {
  TUTOR_SPOTLIGHT_COPY,
} from './templates/TutorSpotlight'
import PerfectTutor, { PERFECT_TUTOR_COPY } from './templates/PerfectTutor'

/**
 * The ad library index.
 *
 * Everything that enumerates creatives — the gallery, the batch generator, the
 * export route — reads from here. Adding a template is a single entry: build
 * the component, export its copy deck, register it.
 */
export const AD_TEMPLATES: AdTemplate[] = [
  {
    id: 'teach-more-keep-more',
    name: 'Teach more. Keep more.',
    description:
      'Earnings-led tutor acquisition with the take-home comparison panel.',
    audience: 'tutor',
    formats: [
      'leaderboard',
      'square',
      'portrait',
      'story',
      'wide',
      'mrec',
      'skyscraper',
    ],
    tutorSlots: 0,
    component: TeachMoreKeepMore,
    defaults: TEACH_MORE_KEEP_MORE_COPY,
  },
  {
    id: 'your-skills-your-income',
    name: 'Your skills. Your income.',
    description: 'Autonomy-led tutor acquisition with the value-prop checklist.',
    audience: 'tutor',
    formats: ['square', 'portrait', 'leaderboard', 'story', 'mrec'],
    tutorSlots: 0,
    component: YourSkillsYourIncome,
    defaults: YOUR_SKILLS_YOUR_INCOME_COPY,
  },
  {
    id: 'fairer-platform',
    name: 'Our terms, in plain sight.',
    description:
      'States TutorBoost\'s own terms as a table. Becomes a two-column comparison, with a comparative headline, only once competitor claims are sourced.',
    audience: 'tutor',
    formats: ['square', 'portrait', 'leaderboard', 'mrec'],
    tutorSlots: 0,
    component: FairerPlatform,
    defaults: FAIRER_PLATFORM_COPY,
  },
  {
    id: 'learn-with-great-tutors',
    name: 'Learn with great tutors.',
    description: 'General-purpose student acquisition for cold traffic.',
    audience: 'student',
    formats: ['square', 'portrait', 'leaderboard', 'story', 'mrec'],
    tutorSlots: 0,
    component: LearnWithGreatTutors,
    defaults: LEARN_WITH_GREAT_TUTORS_COPY,
  },
  {
    id: 'more-choice-better-learning',
    name: 'More choice. Better learning.',
    description:
      'Marketplace breadth, with a card stack rendered from three live tutors.',
    audience: 'student',
    formats: ['square', 'portrait', 'leaderboard', 'story'],
    tutorSlots: 3,
    component: MoreChoiceBetterLearning,
    defaults: MORE_CHOICE_COPY,
  },
  {
    id: 'student-poster',
    name: 'Student poster',
    description:
      'Long-form hero: benefits, subject strip and social proof. Print / landing.',
    audience: 'student',
    formats: ['poster', 'portrait', 'story'],
    tutorSlots: 5,
    component: StudentPoster,
    defaults: STUDENT_POSTER_COPY,
  },
  {
    id: 'perfect-tutor',
    name: 'Your perfect tutor is here.',
    description:
      'Platform promises beside a live tutor profile card — the highest-intent student creative.',
    audience: 'student',
    formats: ['poster', 'portrait', 'story', 'square', 'leaderboard', 'mrec'],
    tutorSlots: 1,
    component: PerfectTutor,
    defaults: PERFECT_TUTOR_COPY,
  },
  {
    id: 'tutor-spotlight',
    name: 'Tutor spotlight',
    description:
      'One ad per tutor — name, stats, subjects and testimonial straight from the record.',
    audience: 'student',
    formats: ['square', 'portrait', 'story', 'leaderboard', 'mrec', 'skyscraper'],
    tutorSlots: 1,
    component: TutorSpotlight,
    defaults: TUTOR_SPOTLIGHT_COPY,
  },
]

export const getAdTemplate = (id: string): AdTemplate | undefined =>
  AD_TEMPLATES.find((template) => template.id === id)

/** Templates that render a specific tutor, i.e. the ones worth batching. */
export const TUTOR_DRIVEN_TEMPLATES = AD_TEMPLATES.filter(
  (template) => template.tutorSlots > 0,
)

export const templatesForAudience = (audience: 'tutor' | 'student') =>
  AD_TEMPLATES.filter((template) => template.audience === audience)
