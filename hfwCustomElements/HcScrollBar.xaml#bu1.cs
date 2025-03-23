using System;
using System.Diagnostics;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;


namespace hfwCustomElements
{
    #region ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 0)
    /// <summary>
    /// HcDoubleHelper
    /// </summary>
    public static class HcDoubleHelper
    {
        /// <summary>
        /// 비율값이 0 ~ 1 사이에 있는 체크
        /// </summary>
        /// <param name="tv"></param>
        /// <returns></returns>
        public static double CheckRatio(double tv)
        {
            if (double.IsInfinity(tv) || double.IsNaN(tv))
                return 0.0;
            else
            {
                if (tv < 0.0) return 0.0;
                else if (tv > 1.0) return 1.0;
            }

            return tv;
        }

        /// <summary>
        /// 비율값 계산
        /// </summary>
        /// <param name="v1"></param>
        /// <param name="v2"></param>
        /// <returns></returns>
        public static double CalcRatio(double v1, double v2)
        {
            double rv = v1 / v2;

            return CheckRatio(rv);
        }
    }


    /// <summary>
    /// HeScrollType
    /// </summary>
    public enum HeScrollType
    {
        None,
        Both,
        Horizontal,
        Vertical
    }


    /// <summary>
    /// HcScrollArea
    /// </summary>
    public sealed class HcScrollTargetArea
    {
        public HcScrollTargetArea(Rect rctViewport, Rect rctBody)
        {
            UpdateViewportBounds(rctViewport);
            UpdateBodyBounds(rctBody);
        }


        #region [1) ViewportBounds]
        /// <summary>
        /// ViewportBounds (컨텐츠가 표시되는 영역 Canvas)
        /// </summary>
        public Rect ViewportBounds { get; private set; }
        internal void UpdateViewportBounds(Rect rct)
        {
            ViewportBounds = rct;
        }
        internal void UpdateViewportWidth(double tv)
        {
            Rect rct = ViewportBounds;
            rct.Width = tv;
            ViewportBounds = rct;
        }
        internal void UpdateViewportHeight(double tv)
        {
            Rect rct = ViewportBounds;
            rct.Height = tv;
            ViewportBounds = rct;
        }
        internal void UpdateViewportLeft(double tv)
        {
            Rect rct = ViewportBounds;
            rct.X = tv;
            ViewportBounds = rct;
        }
        internal void UpdateViewportTop(double tv)
        {
            Rect rct = ViewportBounds;
            rct.Y = tv;
            ViewportBounds = rct;
        }
        public double GetViewportWidthRatio()
        {
            double val = ViewportBounds.Width / BodyBounds.Width;
            return HcDoubleHelper.CheckRatio(val);
        }

        public double GetViewportHeightRatio()
        {
            double val = ViewportBounds.Height / BodyBounds.Height;
            return HcDoubleHelper.CheckRatio(val);
        }
        #endregion

        #region [2) BodyBounds]
        /// <summary>
        /// BodyBounds (컨텐츠 영역)
        /// </summary>
        public Rect BodyBounds { get; private set; }
        internal void UpdateBodyBounds(Rect rct)
        {
            BodyBounds = rct;
        }
        internal void UpdateBodyWidth(double tv)
        {
            Rect rct = BodyBounds;
            rct.Width = tv;
            BodyBounds = rct;
        }
        internal void UpdateBodyHeight(double tv)
        {
            Rect rct = BodyBounds;
            rct.Height = tv;
            BodyBounds = rct;
        }
        internal void UpdateBodyLeft(double tv)
        {
            Rect rct = BodyBounds;
            rct.X = tv;
            BodyBounds = rct;
        }
        internal void UpdateBodyTop(double tv)
        {
            Rect rct = BodyBounds;
            rct.Y = tv;
            BodyBounds = rct;
        }
        internal void CalcBodyLeft(double spr)
        {
            double dff = ViewportBounds.Width - BodyBounds.Width;
            if (dff > 0.0) dff = 0.0;

            double tv = dff * spr;
            UpdateBodyLeft(tv);
        }
        internal void CalcBodyTop(double spr)
        {
            double dff = ViewportBounds.Height - BodyBounds.Height;
            if (dff > 0.0) dff = 0.0;

            double tv = dff * spr;
            UpdateBodyTop(tv);
        }
        #endregion

        ///// <summary>
        ///// VirtualBounds (엘리먼트가 가상으로 렌더링되는 영역)
        ///// </summary>
        //public Rect VirtualBounds { get; private set; }
        //internal void CalcVirtualBounds(double hspr, double vspr)
        //{
        //}
    }
    #endregion



    #region ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 1)
    /// <summary>
    /// HcScrollBar.xaml에 대한 상호 작용 논리
    /// </summary>
    public sealed partial class HcScrollBar : Canvas
    {
        #region [1) 초기화]
        /// <summary>
        /// Thumb의 최소 사이즈
        /// </summary>
        private const double _minsz = 10.0;


        public event EventHandler Scroll;

        private Border m_elThumb;
        private TextBlock m_elTxb;
        private RotateTransform m_rtf;

        public HcScrollBar()
        {
            InitializeComponent();

            m_elThumb = (Border)Children[0];
            m_elTxb = (TextBlock)m_elThumb.Child;
            m_rtf = (RotateTransform)m_elTxb.LayoutTransform;
        }

        public HcScrollTargetArea TargetArea { get; private set; }
        public HeScrollType LogicType { get; private set; }
        public void InitOnce(HcScrollTargetArea sta, HeScrollType type)
        {
            if (TargetArea != null)
            {
                throw new Exception("Please initialize only once.");
            }

            TargetArea = sta;
            LogicType = type;

            if (LogicType == HeScrollType.Both)
            {
                m_twr = TargetArea.GetViewportWidthRatio();
                m_thr = TargetArea.GetViewportHeightRatio();

                m_hspr = 0.0;
                m_vspr = 0.0;

                m_rtf.Angle = 0.0;
            }
            else if (LogicType == HeScrollType.Horizontal)
            {
                m_twr = TargetArea.GetViewportWidthRatio();
                m_thr = 1.0;

                m_hspr = 0.0;
                m_vspr = 0.0;

                m_rtf.Angle = 0.0;
            }
            else if (LogicType == HeScrollType.Vertical)
            {
                m_twr = 1.0;
                m_thr = TargetArea.GetViewportHeightRatio();

                m_hspr = 0.0;
                m_vspr = 0.0;

                m_rtf.Angle = 90.0;
            }
            else
            {
                //~~~
                return;
            }

            IsHitTestVisible = true;
            m_elThumb.Visibility = Visibility.Visible;

            prUpdateGroundThumbRects();
        }
        #endregion


        #region [2) 구현부]
        /// <summary>
        /// RectGround
        /// </summary>
        private Rect m_rctGround;
        public Rect GetRectGround()
        {
            return m_rctGround;
        }

        /// <summary>
        /// RectThumb
        /// </summary>
        private Rect m_rctThumb;
        public Rect GetRectThumb()
        {
            return m_rctThumb;
        }

        /// <summary>
        /// Thumb Width Ratio
        /// </summary>
        private double m_twr;
        public double GetThumbWidthRatio()
        {
            return m_twr;
        }
        public void SetThumbWidthRatio(double tv)
        {
            if (tv == m_twr) return;
            m_twr = HcDoubleHelper.CheckRatio(tv);

            double tw = m_rctGround.Width * m_twr;
            if (tw < _minsz) tw = _minsz;
            m_rctThumb.Width = tw;

            double tss = prCalcHoriScrollSize();
            double tx = tss * m_hspr;
            m_rctThumb.X = tx;

            prApplyRectThumb(HeScrollType.Horizontal);
            prPrintSpanLog();
        }

        /// <summary>
        /// Thumb Height Ratio
        /// </summary>
        private double m_thr;
        public double GetThumbHeightRatio()
        {
            return m_thr;
        }
        public void SetThumbHeightRatio(double tv)
        {
            if (tv == m_thr) return;
            m_thr = HcDoubleHelper.CheckRatio(tv);

            double th = m_rctGround.Height * m_thr;
            if (th < _minsz) th = _minsz;
            m_rctThumb.Height = th;

            double tss = prCalcVertScrollSize();
            double ty = tss * m_vspr;
            m_rctThumb.Y = ty;

            prApplyRectThumb(HeScrollType.Vertical);
            prPrintSpanLog();
        }


        /// <summary>
        /// Horizontal Scroll Position Ratio
        /// </summary>
        private double m_hspr;
        public double GetHoriScrollRatio()
        {
            return m_hspr;
        }
        public void SetHoriScrollRatio(double tv)
        {
            if (tv == m_hspr) return;
            m_hspr = HcDoubleHelper.CheckRatio(tv);

            double tss = prCalcHoriScrollSize();
            double ty = tss * m_hspr;
            m_rctThumb.X = ty;

            SetLeft(m_elThumb, m_rctThumb.Left);
            prPrintSpanLog();
        }

        /// <summary>
        /// Vertical Scroll Position Ratio
        /// </summary>
        private double m_vspr;
        public double GetVertScrollRatio()
        {
            return m_vspr;
        }
        public void SetVertScrollRatio(double tv)
        {
            if (tv == m_vspr) return;
            m_vspr = HcDoubleHelper.CheckRatio(tv);

            double tss = prCalcVertScrollSize();
            double ty = tss * m_vspr;
            m_rctThumb.Y = ty;

            SetTop(m_elThumb, m_rctThumb.Top);
            prPrintSpanLog();
        }

        private void prPrintSpanLog()
        {
            if (LogicType == HeScrollType.Both)
            {
                double phsr = 100 * m_twr;
                double phpr = 100 * m_hspr;
                double pvsr = 100 * m_thr;
                double pvpr = 100 * m_vspr;
                string txt = $@"
{phsr.ToString("F1")}%/{phpr.ToString("F1")}%
{pvsr.ToString("F1")}%/{pvpr.ToString("F1")}%".Trim();
                m_elTxb.Text = txt;
            }
            else if (LogicType == HeScrollType.Horizontal)
            {
                double phsr = 100 * m_twr;
                double phpr = 100 * m_hspr;
                string txt = $@"
{phsr.ToString("F1")}%/{phpr.ToString("F1")}%".Trim();
                m_elTxb.Text = txt;
            }
            else if (LogicType == HeScrollType.Vertical)
            {
                double pvsr = 100 * m_thr;
                double pvpr = 100 * m_vspr;
                string txt = $@"
{pvsr.ToString("F1")}%/{pvpr.ToString("F1")}%".Trim();
                m_elTxb.Text = txt;
            }
        }

        private double prCalcHoriScrollSize()
        {
            double df = m_rctGround.Width - m_rctThumb.Width;
            if (df < 0.0) df = 0.0;

            return df;
        }

        private double prCalcVertScrollSize()
        {
            double df = m_rctGround.Height - m_rctThumb.Height;
            if (df < 0.0) df = 0.0;

            return df;
        }

        private void prApplyRectThumb(HeScrollType type)
        {
            if (type == HeScrollType.Both)
            {
                m_elThumb.Width = m_rctThumb.Width;
                m_elThumb.Height = m_rctThumb.Height;

                SetLeft(m_elThumb, m_rctThumb.Left);
                SetTop(m_elThumb, m_rctThumb.Top);
            }
            else if (type == HeScrollType.Horizontal)
            {
                m_elThumb.Width = m_rctThumb.Width;

                SetLeft(m_elThumb, m_rctThumb.Left);
            }
            else if (type == HeScrollType.Vertical)
            {
                m_elThumb.Height = m_rctThumb.Height;

                SetTop(m_elThumb, m_rctThumb.Top);
            }
        }

        private void prUpdateGroundThumbRects()
        {
            if (LogicType == HeScrollType.None) return;

            m_rctGround = VisualTreeHelper.GetContentBounds(this);

            double tw = m_rctGround.Width * m_twr;
            if (tw < _minsz) tw = _minsz;
            m_rctThumb.Width = tw;

            double th = m_rctGround.Height * m_thr;
            if (th < _minsz) th = _minsz;
            m_rctThumb.Height = th;

            double hss = prCalcHoriScrollSize();
            m_rctThumb.X = hss * m_hspr;

            double vss = prCalcVertScrollSize();
            m_rctThumb.Y = vss * m_vspr;


            prApplyRectThumb(HeScrollType.Both);
            prPrintSpanLog();

            Scroll?.Invoke(this, null);
        }

        protected override void OnRenderSizeChanged(SizeChangedInfo sci)
        {
            base.OnRenderSizeChanged(sci);

            prUpdateGroundThumbRects();
        }
        #endregion


        #region [3) 기능]
        private bool prCheckUpdateThumbLeft(double tx)
        {
            if ((m_twr >= 1.0) || (tx == m_rctThumb.Left)) return false;
            //Debug.WriteLine("prCheckUpdateThumbLeft");

            double bx = 0.0;
            double ex = prCalcHoriScrollSize();

            double cx = tx;
            if (cx < bx) cx = bx;
            else if (cx > ex) cx = ex;
            m_rctThumb.X = cx;

            double v1 = cx - bx;
            double v2 = ex - bx;
            m_hspr = HcDoubleHelper.CalcRatio(v1, v2);

            TargetArea.CalcBodyLeft(m_hspr);

            return true;
        }

        private bool prCheckUpdateThumbTop(double ty)
        {
            if ((m_thr >= 1.0) || (ty == m_rctThumb.Top)) return false;
            //Debug.WriteLine("prCheckUpdateThumbTop");

            double by = 0.0;
            double ey = prCalcVertScrollSize();

            double cy = ty;
            if (cy < by) cy = by;
            else if (cy > ey) cy = ey;
            m_rctThumb.Y = cy;

            double v1 = cy - by;
            double v2 = ey - by;
            m_vspr = HcDoubleHelper.CalcRatio(v1, v2);

            TargetArea.CalcBodyTop(m_vspr);

            return true;
        }

        private void prUpdateThumbLocation(double tx, double ty)
        {
            bool bAfter = false;

            if (prCheckUpdateThumbLeft(tx))
            {
                SetLeft(m_elThumb, m_rctThumb.Left);
                bAfter = true;
            }

            if (prCheckUpdateThumbTop(ty))
            {
                SetTop(m_elThumb, m_rctThumb.Top);
                bAfter = true;
            }

            if (bAfter)
            {
                prPrintSpanLog();

                Scroll?.Invoke(this, null);
            }
        }

        private void prUpdateThumbLeft(double tx)
        {
            if (prCheckUpdateThumbLeft(tx))
            {
                SetLeft(m_elThumb, m_rctThumb.Left);
                prPrintSpanLog();

                Scroll?.Invoke(this, null);
            }
        }

        private void prUpdateThumbTop(double ty)
        {
            if (prCheckUpdateThumbTop(ty))
            {
                SetTop(m_elThumb, m_rctThumb.Top);
                prPrintSpanLog();

                Scroll?.Invoke(this, null);
            }
        }


        private double m_mdx;
        private double m_mdy;

        protected override void OnLostMouseCapture(MouseEventArgs ea)
        {
            base.OnLostMouseCapture(ea);

            if (ea.LeftButton == MouseButtonState.Pressed)
                OnMouseLeftButtonUp(null);
        }

        protected override void OnMouseLeftButtonUp(MouseButtonEventArgs ea)
        {
            if (ea != null) base.OnMouseLeftButtonUp(ea);

            Mouse.Capture(null);
        }

        protected override void OnMouseMove(MouseEventArgs ea)
        {
            if (ea != null) base.OnMouseMove(ea);

            if ((Mouse.LeftButton == MouseButtonState.Pressed) &&
                (Mouse.Captured == this))
            {
                Point mpt = Mouse.GetPosition(this);
                if (LogicType == HeScrollType.Both)
                {
                    double tx = mpt.X - m_mdx;
                    double ty = mpt.Y - m_mdy;

                    prUpdateThumbLocation(tx, ty);
                }
                else if (LogicType == HeScrollType.Horizontal)
                {
                    double tx = mpt.X - m_mdx;

                    prUpdateThumbLeft(tx);
                }
                else if (LogicType == HeScrollType.Vertical)
                {
                    double ty = mpt.Y - m_mdy;

                    prUpdateThumbTop(ty);
                }
            }
        }

        protected override void OnMouseLeftButtonDown(MouseButtonEventArgs ea)
        {
            base.OnMouseLeftButtonDown(ea);

            Point mpt = Mouse.GetPosition(this);
            if (m_rctThumb.Contains(mpt))
            {
                m_mdx = mpt.X - m_rctThumb.Left;
                m_mdy = mpt.Y - m_rctThumb.Top;

                OnMouseMove(null);
            }
            else
            {
                if (LogicType == HeScrollType.Both)
                {
                    double tx = mpt.X - (m_rctThumb.Width / 2);
                    double ty = mpt.Y - (m_rctThumb.Height / 2);

                    prUpdateThumbLocation(tx, ty);
                }
                else if (LogicType == HeScrollType.Horizontal)
                {
                    double tx = mpt.X - (m_rctThumb.Width / 2);

                    prUpdateThumbLeft(tx);
                }
                else if (LogicType == HeScrollType.Vertical)
                {
                    double ty = mpt.Y - (m_rctThumb.Height / 2);

                    prUpdateThumbTop(ty);
                }

                m_mdx = mpt.X - m_rctThumb.Left;
                m_mdy = mpt.Y - m_rctThumb.Top;
            }

            Mouse.Capture(this);
        }

        public void UpdateViewportSize(double tw, double th)
        {
            TargetArea.UpdateViewportWidth(tw);
            TargetArea.UpdateViewportHeight(th);
            TargetArea.CalcBodyLeft(m_hspr);
            TargetArea.CalcBodyTop(m_vspr);
        }
        #endregion

    }
    #endregion
}
