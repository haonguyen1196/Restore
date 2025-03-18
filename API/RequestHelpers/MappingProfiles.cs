using System;
using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.RequestHelpers;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<CreateProductDto, Product>(); // khai báo chuyển đổi dữ liệu từ dto sang entiti
        CreateMap<UpdateProductDto, Product>();
    }
}
