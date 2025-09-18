import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publication } from '../entities/publication.entity';
import { User } from '../entities/user.entity';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';

@Injectable()
export class PublicationsService {
  constructor(
    @InjectRepository(Publication)
    private readonly publicationRepository: Repository<Publication>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createPublicationDto: CreatePublicationDto): Promise<Publication> {
    const user = await this.userRepository.findOne({ 
      where: { id: createPublicationDto.userId } 
    });
    
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${createPublicationDto.userId} no encontrado`);
    }

    const publication = this.publicationRepository.create(createPublicationDto);
    return await this.publicationRepository.save(publication);
  }

  async findAll(): Promise<Publication[]> {
    return await this.publicationRepository.find({
      relations: ['user'],
    });
  }

  async findOne(id: number): Promise<Publication> {
    const publication = await this.publicationRepository.findOne({ 
      where: { id },
      relations: ['user'],
    });
    
    if (!publication) {
      throw new NotFoundException(`Publicación con ID ${id} no encontrada`);
    }
    
    return publication;
  }

  async findByUser(userId: number): Promise<Publication[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    return await this.publicationRepository.find({
      where: { userId },
      relations: ['user'],
    });
  }

  async update(id: number, updatePublicationDto: UpdatePublicationDto): Promise<Publication> {
    const publication = await this.findOne(id);
    
    if (updatePublicationDto.userId) {
      const user = await this.userRepository.findOne({ 
        where: { id: updatePublicationDto.userId } 
      });
      
      if (!user) {
        throw new NotFoundException(`Usuario con ID ${updatePublicationDto.userId} no encontrado`);
      }
    }

    Object.assign(publication, updatePublicationDto);
    return await this.publicationRepository.save(publication);
  }

  async remove(id: number): Promise<void> {
    const publication = await this.findOne(id);
    await this.publicationRepository.remove(publication);
  }
}