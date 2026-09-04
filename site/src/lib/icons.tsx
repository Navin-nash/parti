import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  ActivityIcon as HiActivityIcon,
  AlertCircleIcon as HiAlertCircleIcon,
  ArrowDownRightIcon as HiArrowDownRightIcon,
  ArrowRightIcon as HiArrowRightIcon,
  ArrowUpDownIcon as HiArrowUpDownIcon,
  ArrowUpRightIcon as HiArrowUpRightIcon,
  BellIcon as HiBellIcon,
  BookMarkedIcon as HiBookMarkedIcon,
  BookOpenIcon as HiBookOpenIcon,
  BracesIcon as HiBracesIcon,
  CalendarIcon as HiCalendarIcon,
  CheckIcon as HiCheckIcon,
  ChevronDownIcon as HiChevronDownIcon,
  ChevronRightIcon as HiChevronRightIcon,
  ChevronUpIcon as HiChevronUpIcon,
  ChevronsDownUpIcon as HiChevronsDownUpIcon,
  CircleCheckIcon as HiCircleCheckIcon,
  ClockIcon as HiClockIcon,
  CommandIcon as HiCommandIcon,
  CopyIcon as HiCopyIcon,
  DatabaseIcon as HiDatabaseIcon,
  DownloadIcon as HiDownloadIcon,
  ExternalLinkIcon as HiExternalLinkIcon,
  EyeIcon as HiEyeIcon,
  FileTextIcon as HiFileTextIcon,
  FilterIcon as HiFilterIcon,
  GaugeIcon as HiGaugeIcon,
  GitBranchIcon as HiGitBranchIcon,
  HashIcon as HiHashIcon,
  HomeIcon as HiHomeIcon,
  InboxIcon as HiInboxIcon,
  InfoIcon as HiInfoIcon,
  LayersIcon as HiLayersIcon,
  Layout01Icon as HiLayout01Icon,
  LayoutDashboardIcon as HiLayoutDashboardIcon,
  LightbulbIcon as HiLightbulbIcon,
  LoaderCircleIcon as HiLoaderCircleIcon,
  MapPinIcon as HiMapPinIcon,
  Maximize02Icon as HiMaximize02Icon,
  MenuIcon as HiMenuIcon,
  MinusIcon as HiMinusIcon,
  MonitorIcon as HiMonitorIcon,
  MoonIcon as HiMoonIcon,
  MoreHorizontalIcon as HiMoreHorizontalIcon,
  NotebookPenIcon as HiNotebookPenIcon,
  OctagonXIcon as HiOctagonXIcon,
  PackageIcon as HiPackageIcon,
  PenLineIcon as HiPenLineIcon,
  PlusIcon as HiPlusIcon,
  QuoteIcon as HiQuoteIcon,
  RefreshCwIcon as HiRefreshCwIcon,
  RepeatIcon as HiRepeatIcon,
  RotateCwIcon as HiRotateCwIcon,
  RulerIcon as HiRulerIcon,
  SearchIcon as HiSearchIcon,
  ServerIcon as HiServerIcon,
  SettingsIcon as HiSettingsIcon,
  ShieldCheckIcon as HiShieldCheckIcon,
  ShieldIcon as HiShieldIcon,
  SlidersHorizontalIcon as HiSlidersHorizontalIcon,
  SmartphoneIcon as HiSmartphoneIcon,
  SquareIcon as HiSquareIcon,
  StarIcon as HiStarIcon,
  SunIcon as HiSunIcon,
  TabletIcon as HiTabletIcon,
  TerminalIcon as HiTerminalIcon,
  TrendingDownIcon as HiTrendingDownIcon,
  TrendingUpIcon as HiTrendingUpIcon,
  TriangleAlertIcon as HiTriangleAlertIcon,
  TruckIcon as HiTruckIcon,
  WalletIcon as HiWalletIcon,
  WrenchIcon as HiWrenchIcon,
  XIcon as HiXIcon,
  ZapIcon as HiZapIcon,
  ArrowDown01Icon as HiArrowDown01Icon,
  ArrowLeft01Icon as HiArrowLeft01Icon,
  BeakerIcon as HiBeakerIcon,
  Blockchain01Icon as HiBlockchain01Icon,
  Compass01Icon as HiCompass01Icon,
  PaintBoardIcon as HiPaintBoardIcon,
  Target02Icon as HiTarget02Icon,
  TextFontIcon as HiTextFontIcon,
  Time04Icon as HiTime04Icon,
} from "@hugeicons/core-free-icons";

/**
 * Every icon in this project, backed by Hugeicons.
 *
 * The names match the shape call sites already used so swapping the set was a
 * one-line change per file rather than 83 hand edits - and, more usefully,
 * there is now exactly one place where icon identity and stroke weight are
 * decided. Icons imported ad hoc drift in weight within a few components, and
 * that drift is one of the tells this site argues against.
 *
 * Stroke is 1.5 everywhere. Size comes from the `size-*` class at the call
 * site, which beats the rendered width/height attributes, so `size-3` on a
 * 24px default still yields 12px.
 */
export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  strokeWidth?: number;
}

function make(icon: IconSvgElement) {
  const Component = ({ size = 24, strokeWidth = 1.5, ...rest }: IconProps) => (
    <HugeiconsIcon icon={icon} size={size} strokeWidth={strokeWidth} {...rest} />
  );
  return Component;
}

export const Activity = make(HiActivityIcon);
export const AlertCircle = make(HiAlertCircleIcon);
export const AlertTriangle = make(HiTriangleAlertIcon);
export const ArrowDownRight = make(HiArrowDownRightIcon);
export const ArrowRight = make(HiArrowRightIcon);
export const ArrowUpDown = make(HiArrowUpDownIcon);
export const ArrowUpRight = make(HiArrowUpRightIcon);
export const Bell = make(HiBellIcon);
export const BookMarked = make(HiBookMarkedIcon);
export const BookOpen = make(HiBookOpenIcon);
export const Braces = make(HiBracesIcon);
export const Calendar = make(HiCalendarIcon);
export const Check = make(HiCheckIcon);
export const CheckIcon = make(HiCheckIcon);
export const ChevronDown = make(HiChevronDownIcon);
export const ChevronDownIcon = make(HiChevronDownIcon);
export const ChevronRight = make(HiChevronRightIcon);
export const ChevronRightIcon = make(HiChevronRightIcon);
export const ChevronUpIcon = make(HiChevronUpIcon);
export const ChevronsUpDown = make(HiChevronsDownUpIcon);
export const CircleAlert = make(HiAlertCircleIcon);
export const CircleCheckIcon = make(HiCircleCheckIcon);
export const Clock = make(HiClockIcon);
export const Columns2 = make(HiLayout01Icon);
export const Command = make(HiCommandIcon);
export const Copy = make(HiCopyIcon);
export const Database = make(HiDatabaseIcon);
export const Download = make(HiDownloadIcon);
export const ExternalLink = make(HiExternalLinkIcon);
export const Eye = make(HiEyeIcon);
export const FileText = make(HiFileTextIcon);
export const Filter = make(HiFilterIcon);
export const Gauge = make(HiGaugeIcon);
export const GitBranch = make(HiGitBranchIcon);
export const Hash = make(HiHashIcon);
export const Home = make(HiHomeIcon);
export const Inbox = make(HiInboxIcon);
export const InfoIcon = make(HiInfoIcon);
export const Layers = make(HiLayersIcon);
export const LayoutDashboard = make(HiLayoutDashboardIcon);
export const Lightbulb = make(HiLightbulbIcon);
export const Loader2 = make(HiLoaderCircleIcon);
export const Loader2Icon = make(HiLoaderCircleIcon);
export const MapPin = make(HiMapPinIcon);
export const Maximize2 = make(HiMaximize02Icon);
export const Menu = make(HiMenuIcon);
export const Minus = make(HiMinusIcon);
export const Monitor = make(HiMonitorIcon);
export const Moon = make(HiMoonIcon);
export const MoreHorizontal = make(HiMoreHorizontalIcon);
export const NotebookPen = make(HiNotebookPenIcon);
export const OctagonXIcon = make(HiOctagonXIcon);
export const Package = make(HiPackageIcon);
export const PenLine = make(HiPenLineIcon);
export const Plus = make(HiPlusIcon);
export const Quote = make(HiQuoteIcon);
export const RefreshCw = make(HiRefreshCwIcon);
export const Repeat = make(HiRepeatIcon);
export const RotateCw = make(HiRotateCwIcon);
export const Ruler = make(HiRulerIcon);
export const Search = make(HiSearchIcon);
export const SearchIcon = make(HiSearchIcon);
export const Server = make(HiServerIcon);
export const Settings = make(HiSettingsIcon);
export const Shield = make(HiShieldIcon);
export const ShieldCheck = make(HiShieldCheckIcon);
export const SlidersHorizontal = make(HiSlidersHorizontalIcon);
export const Smartphone = make(HiSmartphoneIcon);
export const Square = make(HiSquareIcon);
export const Star = make(HiStarIcon);
export const Sun = make(HiSunIcon);
export const Tablet = make(HiTabletIcon);
export const Terminal = make(HiTerminalIcon);
export const TrendingDown = make(HiTrendingDownIcon);
export const TrendingUp = make(HiTrendingUpIcon);
export const TriangleAlert = make(HiTriangleAlertIcon);
export const TriangleAlertIcon = make(HiTriangleAlertIcon);
export const Truck = make(HiTruckIcon);
export const Wallet = make(HiWalletIcon);
export const Wrench = make(HiWrenchIcon);
export const X = make(HiXIcon);
export const XIcon = make(HiXIcon);
export const Zap = make(HiZapIcon);

export const ArrowDown = make(HiArrowDown01Icon);
export const ArrowLeft = make(HiArrowLeft01Icon);
export const Beaker = make(HiBeakerIcon);
export const Blockchain = make(HiBlockchain01Icon);
export const Compass = make(HiCompass01Icon);
export const PaintBoard = make(HiPaintBoardIcon);
export const Target = make(HiTarget02Icon);
export const TextFont = make(HiTextFontIcon);
export const Time = make(HiTime04Icon);
