using System;
using API.RequestHelpers;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;

namespace API.Services;

public class ImageService
{
    private readonly Cloudinary _cloudinary;

    public ImageService(IOptions<CloudinarySettings> config)
    {
        var acc = new Account(
            config.Value.CloudName,
            config.Value.ApiKey,
            config.Value.ApiSecret
        ); // gửi các thông tin xác thực để kết nói với cloud

        _cloudinary = new Cloudinary(acc); // tạo đối tượng từ các thông tin xác thực
    }

    public async Task<ImageUploadResult> AddImageAsync(IFormFile file)
    {
        var uploadResult = new ImageUploadResult();

        if (file.Length > 0) // nếu file có dữ liệu
        {
            using var stream = file.OpenReadStream();// đọc nội dung file
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream), // File bao gồm tên file và dữ liệu stream
                Folder = "restore" //chỉ định thư mục lưu ảnh trên cloud
            };
            uploadResult = await _cloudinary.UploadAsync(uploadParams); // gọi api cloudinary để tải ảnh lên
        }

        return uploadResult; // trả về kết quả
    }

    public async Task<DeletionResult> DeleteImageAsync(string publicId)
    {
        var deleteParams = new DeletionParams(publicId); // tạo deleteParams với public Id của ảnh

        var result = await _cloudinary.DestroyAsync(deleteParams); // gọi api xóa ảnh

        return result; // trả về kết quả
    }
}
