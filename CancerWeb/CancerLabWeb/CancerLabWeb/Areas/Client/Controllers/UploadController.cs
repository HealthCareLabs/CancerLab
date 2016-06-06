using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Hosting;
using System.Web.Http;
using System.Web.Mvc;
using CancerLabWeb.Areas.Client.Filters;
using CancerLabWeb.Areas.Client.Models;
using CancerLabWeb.Areas.Dashboard.Filters;
using CancerLabWeb.Context;

namespace CancerLabWeb.Areas.Client.Controllers
{
    public class UploadController : ApiController
    {
        private readonly BaseContext _dbContext = new BaseContext();

        /// <summary>
        /// Upload image to server
        /// </summary>
        /// <remarks>
        ///  Requires authentication
        /// </remarks>
        /// <param>Multipart stream with file info</param>
        /// <returns>List of ids for uploaded images</returns>
        //[ApiAllowAnonymous]
        [System.Web.Http.HttpPost, System.Web.Http.Route("api/upload")]
        public async Task<UploadResult> Upload()
        {
            if (!Request.Content.IsMimeMultipartContent())
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            int userId = int.Parse(Thread.CurrentPrincipal.Identity.Name);
            var provider = new MultipartFormDataStreamProvider(HostingEnvironment.MapPath("~/Images/Issues/"));
            await Request.Content.ReadAsMultipartAsync(provider);
            var imageIds = new List<int>();
            foreach (var file in provider.FileData)
            {
                FileInfo fileInfo = new FileInfo(file.LocalFileName);
                var buffer = File.ReadAllBytes(file.LocalFileName);
                var srcImage = Image.FromStream(new MemoryStream(buffer));
                var thumbnailImage = ImageProcessor.FixedSize(srcImage, 150, 150, true);
                var img = new ImageModel
                {
                    ThumbnailPath = ImageProcessor.SaveImageToServer(thumbnailImage),
                    FullSizePath = ImageProcessor.SaveImageToServer(srcImage),
                    SourceImage = buffer,
                    Owner = _dbContext.PatientProfiles.First(x => x.PatientId == userId)
                };
                _dbContext.Images.Add(img);
                _dbContext.SaveChanges();
                imageIds.Add(img.ImageId);
            }

            return new UploadResult() { ImageIds = imageIds };
        }
        /// <summary>
        /// Result of iamge upload
        /// </summary>
        public class UploadResult
        {
            /// <summary>
            /// List of ids of images
            /// </summary>
            public List<int> ImageIds { get; set; }
        }
    }
    /// <summary>
    /// Provides functionality to save and crop images
    /// </summary>
    public static class ImageProcessor
    {
        /// <summary>
        /// Saves image to folder
        /// </summary>
        /// <param name="image">Image which should be saved</param>
        /// <returns></returns>
        public static string SaveImageToServer(Image image)
        {
            string guid = Guid.NewGuid().ToString();
            string spath = HostingEnvironment.MapPath("~/Content/Images/Issues/") + guid + ".jpeg";
            image.Save(spath);
            return spath;
        }
        /// <summary>
        /// Crops image to make thumbnail
        /// </summary>
        /// <param name="image">Image to be resied</param>
        /// <param name="width">Result width</param>
        /// <param name="height">Result height</param>
        /// <param name="needToFill">Should image be filled</param>
        /// <returns></returns>
        public static Image FixedSize(Image image, int width, int height, bool needToFill)
        {
            int sourceWidth = image.Width;
            int sourceHeight = image.Height;
            int sourceX = 0;
            int sourceY = 0;
            double destX = 0;
            double destY = 0;

            double nScale = 0;
            double nScaleW = 0;
            double nScaleH = 0;

            nScaleW = ((double)width / (double)sourceWidth);
            nScaleH = ((double)height / (double)sourceHeight);
            if (!needToFill)
            {
                nScale = Math.Min(nScaleH, nScaleW);
            }
            else
            {
                nScale = Math.Max(nScaleH, nScaleW);
                destY = (height - sourceHeight * nScale) / 2;
                destX = (width - sourceWidth * nScale) / 2;
            }

            if (nScale > 1)
                nScale = 1;

            int destWidth = (int)Math.Round(sourceWidth * nScale);
            int destHeight = (int)Math.Round(sourceHeight * nScale);

            Bitmap bmPhoto = null;
            try
            {
                bmPhoto = new Bitmap(destWidth + (int)Math.Round(2 * destX), destHeight + (int)Math.Round(2 * destY));
            }
            catch (Exception ex)
            {
                throw new ApplicationException(
                    $"destWidth:{destWidth}, destX:{destX}, destHeight:{destHeight}, desxtY:{destY}, Width:{width}, Height:{height}", ex);
            }
            using (Graphics grPhoto = Graphics.FromImage(bmPhoto))
            {
                grPhoto.InterpolationMode = InterpolationMode.HighQualityBicubic;
                grPhoto.CompositingQuality = CompositingQuality.HighQuality;
                grPhoto.SmoothingMode = SmoothingMode.HighQuality;

                Rectangle to = new Rectangle((int)Math.Round(destX), (int)Math.Round(destY), destWidth, destHeight);
                Rectangle from = new Rectangle(sourceX, sourceY, sourceWidth, sourceHeight);

                grPhoto.DrawImage(image, to, @from, GraphicsUnit.Pixel);

                return bmPhoto;
            }
        }
    }
}