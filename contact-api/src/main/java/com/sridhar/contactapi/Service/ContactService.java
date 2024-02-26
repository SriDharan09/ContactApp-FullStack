package com.sridhar.contactapi.Service;


import com.sridhar.contactapi.Model.Contact;
import com.sridhar.contactapi.Repository.ContactRepository;
import jakarta.servlet.Servlet;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.support.ReplaceOverride;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.function.BiFunction;
import java.util.function.Function;

import static com.sridhar.contactapi.Constant.Constant.PHOTO_DIRECTORY;
import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

@Service
@Slf4j
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
public class ContactService {


    private final ContactRepository contactRepository;

    public Page<Contact>getAllContact(int page ,int size){
        return contactRepository.findAll(PageRequest.of(page, size, Sort.by("name")));
    }

    public Contact getContact(String id){
        return contactRepository.findById(id).orElseThrow(()-> new RuntimeException("Contact not found"));
    }

    public Contact createContact(Contact contact){
        return contactRepository.save(contact);
    }

    public void deleteContact(String id){
        contactRepository.deleteById(id);
    }

    public String uploadPhoto(String id, MultipartFile image){
        log.info("Uploading photo for user " + id );
        Contact contact = getContact(id);
        String photoUrl = photoFunction.apply(id,image);
        contact.setPhotoUrl(photoUrl);
        contactRepository.save(contact);
        return photoUrl;
    }

    private final Function<String, String> fileExtension = filename -> Optional.of(filename).filter(name -> name.contains("."))
            .map(name -> name.substring(filename.lastIndexOf(".") + 1)).orElse(".png");

    private final BiFunction<String,MultipartFile,String> photoFunction = (id ,image)-> {
        String filename =  id + fileExtension.apply(image.getOriginalFilename());
        try{
            Path fileStorageLocation = Paths.get(PHOTO_DIRECTORY).toAbsolutePath().normalize();
            if(!Files.exists(fileStorageLocation)){
                Files.createDirectories(fileStorageLocation);
            }
            Files.copy(image.getInputStream(),fileStorageLocation.resolve(filename),REPLACE_EXISTING);
            return ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .path("/contacts/image/"+ filename).toUriString();

        }catch(Exception e){
            throw new RuntimeException("Unable to save");
        }
    };



}
