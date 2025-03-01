using hfwCustomElements;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Windows.Threading;


namespace TESTROLL31
{
    /// <summary>
    /// HcMainWindow.xaml에 대한 상호 작용 논리
    /// </summary>
    public sealed partial class TesterWindow : Window
    {
        #region ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 1)
        public TesterWindow()
        {
            InitializeComponent();
            Loaded += prThisLoaded;
        }

        protected override void OnContentRendered(EventArgs ea)
        {
            base.OnContentRendered(ea);

            SizeToContent = SizeToContent.Manual;
            m_grdrt.Width = double.NaN;
            m_grdrt.Height = double.NaN;
        }

        private void prThisLoaded(object sd, RoutedEventArgs ea)
        {
            Loaded -= prThisLoaded;

            //~~~~
            Rect rctViewport = VisualTreeHelper.GetContentBounds(m_elViewport);
            Rect rctBody = VisualTreeHelper.GetContentBounds(m_elBody);

            m_sta = new HcScrollTargetArea(rctViewport, rctBody);

            m_scrollBoth.InitOnce(m_sta, HeScrollType.Both);
            m_scrollBoth.Scroll += delegate
            {
                prUpdateBodyLocation(HeScrollType.Both);

                m_scrollVert.SetVertScrollRatio(m_scrollBoth.GetVertScrollRatio());
                m_scrollHori.SetHoriScrollRatio(m_scrollBoth.GetHoriScrollRatio());

                prUpdateOutText();
            };

            m_scrollHori.InitOnce(m_sta, HeScrollType.Horizontal);
            m_scrollHori.Scroll += delegate
            {
                m_scrollBoth.SetHoriScrollRatio(m_scrollHori.GetHoriScrollRatio());

                prUpdateOutText();

                prUpdateBodyLocation(HeScrollType.Horizontal);
                //Debug.WriteLine("m_scrollHori.Scroll");
            };

            m_scrollVert.InitOnce(m_sta, HeScrollType.Vertical);
            m_scrollVert.Scroll += delegate
            {
                m_scrollBoth.SetVertScrollRatio(m_scrollVert.GetVertScrollRatio());

                prUpdateOutText();

                prUpdateBodyLocation(HeScrollType.Vertical);
                //Debug.WriteLine("m_scrollVert.Scroll");
            };

            prUpdateOutText();

            SizeChanged += prThisSizeChanged;
        }

        private void prThisSizeChanged(object sd, SizeChangedEventArgs ea)
        {
            if (Visibility != Visibility.Visible) return;

            Rect rctViewport = VisualTreeHelper.GetContentBounds(m_elViewport);
            m_scrollBoth.UpdateViewportSize(rctViewport.Width, rctViewport.Height);

            double vwr = m_sta.GetViewportWidthRatio();
            double vhr = m_sta.GetViewportHeightRatio();
            m_scrollBoth.SetThumbWidthRatio(vwr);
            m_scrollBoth.SetThumbHeightRatio(vhr);

            m_scrollHori.SetThumbWidthRatio(vwr);
            m_scrollVert.SetThumbHeightRatio(vhr);
        }
        #endregion


        private HcScrollTargetArea m_sta;

        private void prUpdateOutText()
        {
            Rect rctViewport = m_sta.ViewportBounds;
            Rect rctBody = m_sta.BodyBounds;
            string txt = $@"
ViewportWidth: {rctViewport.Width},
ViewportHeight: {rctViewport.Height},
ViewportLeft: {rctViewport.Left},
ViewportTop: {rctViewport.Top},
BodyWidth: {rctBody.Width},
BodyHeight: {rctBody.Height},
BodyLeft: {rctBody.Left},
BodyTop: {rctBody.Top},
            ".Trim();
            m_txb31.Text = txt;
        }

        protected override void OnRenderSizeChanged(SizeChangedInfo sci)
        {
            base.OnRenderSizeChanged(sci);

            //if ((Visibility != Visibility.Visible) || (m_sta == null)) return;

            //Rect rctViewport = VisualTreeHelper.GetContentBounds(m_elViewport);
            ////Rect rctBody = VisualTreeHelper.GetContentBounds(m_elBody);
            //m_sta.UpdateViewportWidth(rctViewport.Width);
            //m_sta.UpdateViewportHeight(rctViewport.Height);
            ////m_sta.UpdateBodyBounds(rctBody);

            //double vwr = m_sta.GetViewportWidthRatio();
            //double vhr = m_sta.GetViewportHeightRatio();
            //m_scrollBoth.SetThumbWidthRatio(vwr);
            //m_scrollBoth.SetThumbHeightRatio(vhr);

            //m_scrollHori.SetThumbWidthRatio(vwr);
            //m_scrollVert.SetThumbHeightRatio(vhr);

            //prUpdateBodyLocation(HeScrollType.Both);

            //Dispatcher.BeginInvoke(DispatcherPriority.Render,
            //    (Action)delegate
            //    {
            //        if ((Visibility != Visibility.Visible) || (m_sta == null)) return;

            //        Rect rctViewport = VisualTreeHelper.GetContentBounds(m_elViewport);
            //        Rect rctBody = VisualTreeHelper.GetContentBounds(m_elBody);
            //        m_sta.UpdateViewportWidth(rctViewport.Width);
            //        m_sta.UpdateViewportHeight(rctViewport.Height);
            //        //m_sta.UpdateBodyBounds(rctBody);

            //        double vwr = m_sta.GetViewportWidthRatio();
            //        double vhr = m_sta.GetViewportHeightRatio();
            //        m_scrollBoth.SetThumbWidthRatio(vwr);
            //        m_scrollBoth.SetThumbHeightRatio(vhr);

            //        m_scrollHori.SetThumbWidthRatio(vwr);
            //        m_scrollVert.SetThumbHeightRatio(vhr);

            //        prUpdateBodyLocation(HeScrollType.Both);
            //    });
        }

        private void prUpdateBodyLocation(HeScrollType type)
        {
            if (type == HeScrollType.Both)
            {
                double rx = m_sta.BodyBounds.Left;
                double ry = m_sta.BodyBounds.Top;

                Canvas.SetLeft(m_elBody, rx);
                Canvas.SetTop(m_elBody, ry);
            }
            else if (type == HeScrollType.Horizontal)
            {
                double rx = m_sta.BodyBounds.Left;

                Canvas.SetLeft(m_elBody, rx);
            }
            else if (type == HeScrollType.Vertical)
            {
                double ry = m_sta.BodyBounds.Top;

                Canvas.SetTop(m_elBody, ry);
            }
        }

    }
}
